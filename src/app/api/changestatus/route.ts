import { NextResponse } from "next/server";
import { fetchFromAPI, submitBookingData } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const { bid, payment_type } = await req.json();

    if (!bid) {
      return NextResponse.json({ error: "Missing booking ID" }, { status: 400 });
    }

    console.log('----change status-----');
    console.log(`Change status ${payment_type || 'card'} - booking_id:`, bid);

    // Get affiliate person from cookies
    const cookieHeader = req.headers.get('cookie') || '';
    const utmSourceMatch = cookieHeader.match(/utm_source=([^;]+)/);
    const affiliatePerson = utmSourceMatch ? utmSourceMatch[1] : null;

    const bookingRes = await fetchFromAPI<Record<string, unknown>[]>({
      appName: "app3534482538357",
      moduleName: "bookings",
      query: {
        "sectionData.bookings.booking_id": bid,
      },
      limit: 1,
    });

    if (!bookingRes || bookingRes.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const bookingDoc = bookingRes[0] as { _id: string; sectionData?: { bookings?: Record<string, unknown> }; companyId: string };
    const booking = bookingDoc?.sectionData?.bookings as Record<string, unknown>;

    if (!booking) {
      return NextResponse.json({ error: "Invalid booking data" }, { status: 400 });
    }

    if (booking.pay_status === "Booking Done") {
      console.log(`Already booking done ${payment_type || 'card'}:`, bid);
      return NextResponse.json({ message: "Already booking done", status: 0 });
    }

    const transactionId = booking.transaction_id as string;

    // Fetch hotel data to check booking engine
    const hotelRes = await fetchFromAPI<Record<string, unknown>[]>({
      appName: "app3534482538357",
      moduleName: "company",
      query: {
        "_id": booking.hotel_id as string,
      },
      limit: 1,
    });

    if (!hotelRes || hotelRes.length === 0) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    const hotelData = (hotelRes[0] as Record<string, unknown>).sectionData as Record<string, unknown>;
    const hotel = hotelData.Company as Record<string, unknown>;
    const bookingEngine = hotel.booking_engine || 0;

    // Update pay_status to success first
    booking.pay_status = "success";
    await submitBookingData({
      appName: "app3534482538357",
      moduleName: "bookings",
      body: {
        _id: bookingDoc._id,
        sectionData: { bookings: booking },
        companyId: bookingDoc.companyId,
      },
    });

    // Prepare booking data
    const noOfDays = Number(booking.no_of_days) || 1;
    const arrivalDate = booking.booking_date as string;
    const departureDate = new Date(new Date(arrivalDate).getTime() + noOfDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const roomTypeAmount = Number(booking.amount);
    const noOfRooms = Number(booking.no_of_rooms) || 1;
    const noOfGuests = Number(booking.no_of_guests) || 1;
    const bookingId = booking.booking_id as string;
    const hotelCode = booking.hotel_code as string;
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').split('.')[0];

    // Build room array for OneDay API
    const noDaysArr = [];
    for (let i = 0; i < noOfDays; i++) {
      const roomDate = i === 0 ? arrivalDate : new Date(new Date(arrivalDate).getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      noDaysArr.push({ date: roomDate, amount: roomTypeAmount / (noOfRooms * noOfDays) });
    }

    const roomArr = [];
    for (let r = 1; r <= noOfRooms; r++) {
      roomArr.push({
        id: booking.room_type_code,
        guest_firstname: booking.first_name,
        guest_lastname: booking.last_name,
        arrival_date: arrivalDate,
        departure_date: departureDate,
        totalprice: roomTypeAmount,
        numberofadult: noOfGuests,
        price: noDaysArr,
      });
    }

    let bookingPostJson = '';
    let bookingResultJson = '';

    if (bookingEngine === 1) {
      // OneDay API booking
      console.log('Booking from OneDay');
      
      const oneDayPayload = {
        reservations: {
          reservation: [{
            deposit: "",
            hotel_name: booking.hotel_name,
            commissionamount: "",
            customer: {
              countrycode: "ph",
              first_name: booking.first_name,
              last_name: booking.last_name,
              remarks: `BOOK FROM WEB WITH TRANSACTION ID - ${booking.transaction_id}`,
              email: booking.email,
              city: "",
              address: "",
              telephone: booking.phone,
              zip: "",
            },
            room: roomArr,
            booking_id: booking.booking_id,
            hotel_id: booking.hotel_code,
            site_id: "",
            currencycode: "PHP",
            company: "Cocotel",
            channel_ref_id: "",
            booking_date: booking.booking_date,
            status: "new",
            totalprice: roomTypeAmount.toString(),
          }],
        },
      };

      bookingPostJson = JSON.stringify(oneDayPayload);

      // Store booking request for audit trail
      console.log(`Storing booking request: Booking/booking/${bookingId}_${timestamp}.txt`);
      console.log('OneDay Payload:', bookingPostJson);

      // Call OneDay API
      const oneDayResponse = await fetch('https://apic.1day.io/api/reservation', {
        method: 'POST',
        headers: {
          'x-api-key': '2ede7df06de40789c4542b55fed208bd',
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: bookingPostJson,
      });
      bookingResultJson = await oneDayResponse.text();

      // Store OneDay API response for audit trail
      console.log(`Storing OneDay response: Booking/1day/${bookingId}_${timestamp}.txt`);
      console.log('OneDay Result:', bookingResultJson);
      console.log('Booked 1 day');
      
      const bodyMethod = JSON.parse(bookingResultJson);
      console.log('Booked 1 day:', bodyMethod);

      // Refund protection API call
      const isSold = booking.refundable ? true : false;
      console.log(`Booking ${bookingId} refundable status: ${isSold}`);
      const insuranceDate = new Date(booking.booking_date as string);
      
      const refundPayload = {
        vendorCode: "ven_local_4b9f12af495045669e37110f0bf13951",
        vendorSalesReferenceId: bookingId,
        vendorSalesDate: new Date().toISOString(),
        customerFirstName: booking.first_name,
        customerLastName: booking.last_name,
        paymentTransactionId: transactionId,
        products: [{
          productCode: "HTL",
          currencyCode: "PHP",
          productPrice: Number(booking.amount),
          premiumRate: 8,
          offeringMethod: "OPT-IN",
          sold: isSold,
          insuranceEndDate: insuranceDate.toISOString(),
        }],
      };
      
      const refundPostString = JSON.stringify(refundPayload);
      const refundResponse = await fetch('https://api.protectgroup.co/api/v1/refundprotect/salesoffering', {
        method: 'POST',
        headers: {
          'X-RefundProtect-VendorId': 'ven_local_4b9f12af495045669e37110f0bf13951',
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'X-RefundProtect-AuthToken': 'sk_local_025f9a32a8ab4868b23db576c00f8532',
        },
        body: refundPostString,
      });
      const refundResult = await refundResponse.text();
      
      console.log(`Storing refund request: Booking/refund/request_${bookingId}_${timestamp}.txt`);
      console.log('Refund Request:', refundPostString);
      console.log('Refund Response:', refundResult);
    } else {
      // Ezee API booking
      console.log('Booking from Ezee');
      
      const startDate = arrivalDate;
      const endDate = departureDate;
      const dailyRate = roomTypeAmount / noOfDays;
      const baserateValues = Array(noOfDays).fill(dailyRate).join(',');
      const extradultrateValues = Array(noOfDays).fill('0').join(',');
      const extrachildrateValues = Array(noOfDays).fill('0').join(',');

      // Fetch room details from Ezee
      const roomListParams = new URLSearchParams({
        request_type: 'RoomList',
        HotelCode: booking.hotel_code as string,
        APIKey: hotel.hotel_api_key as string,
        check_in_date: startDate,
        check_out_date: endDate,
        num_nights: '',
        number_adults: noOfGuests.toString(),
        number_children: '0',
        num_rooms: noOfRooms.toString(),
        promotion_code: '',
        property_configuration_info: '0',
        showtax: '0',
        show_only_available_rooms: '0',
        language: 'en',
        roomtypeunkid: booking.room_type_code as string,
        packagefor: 'DESKTOP',
        promotionfor: 'DESKTOP',
      });

      const roomListResponse = await fetch(`https://live.ipms247.com/booking/reservation_api/listing.php?${roomListParams}`);
      const roomListData = await roomListResponse.json();
      
      let ratetypeunkid = '';
      let roomrateunkid = '';
      
      if (Array.isArray(roomListData)) {
        for (const room of roomListData) {
          if (room?.ratetypeunkid && room?.roomrateunkid) {
            ratetypeunkid = room.ratetypeunkid;
            roomrateunkid = room.roomrateunkid;
            console.log('ezee card Ratetype_Id:', ratetypeunkid);
            console.log('ezee card Rateplan_Id:', roomrateunkid);
            break;
          }
        }
      }
      
      if (!ratetypeunkid || !roomrateunkid) {
        console.log('something wrong ratetypeunkid/roomrateunkid');
      }
      
      console.log('booked ezee number of rooms:', noOfRooms);

      const ezeePayload = {
        Room_Details: {
          Room_1: {
            Rateplan_Id: roomrateunkid,
            Ratetype_Id: ratetypeunkid,
            Roomtype_Id: booking.room_type_code,
            baserate: baserateValues,
            extradultrate: extradultrateValues,
            extrachildrate: extrachildrateValues,
            number_adults: noOfGuests.toString(),
            number_of_rooms: noOfRooms.toString(),
            number_children: "0",
            ExtraChild_Age: "0",
            Title: booking.hotel_name,
            First_Name: booking.first_name,
            Last_Name: booking.last_name,
            Gender: "",
            SpecialRequest: "",
          },
        },
        check_in_date: arrivalDate,
        check_out_date: departureDate,
        Booking_Payment_Mode: "",
        Email_Address: booking.email,
        Source_Id: "",
        MobileNo: booking.phone,
        Address: "",
        State: "",
        Country: "",
        City: "",
        Zipcode: "",
        Fax: "",
        Device: "",
        Languagekey: "",
        paymenttypeunkid: "",
      };

      bookingPostJson = JSON.stringify(ezeePayload);

      // Store booking request for audit trail
      console.log(`Storing booking request: Booking/booking/${bookingId}_${timestamp}.txt`);
      console.log('Ezee Payload:', bookingPostJson);

      // Call Ezee InsertBooking API
      const insertParams = new URLSearchParams({
        request_type: 'InsertBooking',
        HotelCode: hotelCode,
        APIKey: hotel.hotel_api_key as string,
      });
      const formData = new FormData();
      formData.append('BookingData', bookingPostJson);
      const insertResponse = await fetch(`https://live.ipms247.com/booking/reservation_api/listing.php?${insertParams}`, {
        method: 'POST',
        body: formData,
      });
      const insertResult = await insertResponse.json();
      bookingResultJson = JSON.stringify(insertResult);
      
      console.log('Booking response ezee:', insertResult);
      console.log('booked ezee insert booking api:', insertResult || 'JSON decode failed');

      if (insertResult?.ReservationNo && insertResult?.Inventory_Mode) {
        const reservationNo = insertResult.ReservationNo;
        const inventoryMode = insertResult.Inventory_Mode;
        
        console.log('EzeeExtracted ReservationNo:', reservationNo);
        console.log('EzeeExtracted Inventory_Mode:', inventoryMode);
        
        const processData = {
          Action: "ConfirmBooking",
          ReservationNo: reservationNo,
          Inventory_Mode: inventoryMode,
          Error_Text: "",
        };
        
        console.log('Process_Data JSON ezee:', processData);
        
        const processParams = new URLSearchParams({
          request_type: 'ProcessBooking',
          HotelCode: hotelCode,
          APIKey: hotel.hotel_api_key as string,
        });
        const processFormData = new FormData();
        processFormData.append('Process_Data', JSON.stringify(processData));
        const processResponse = await fetch(`https://live.ipms247.com/booking/reservation_api/listing.php?${processParams}`, {
          method: 'POST',
          body: processFormData,
        });
        const processResult = await processResponse.text();
        bookingResultJson += processResult;
        
        const processBooking = JSON.parse(processResult);
        console.log('booked ezee process booking api:', processBooking);
        console.log('BookingFinal response ezee:', processResult);
        
        console.log(`Storing Ezee response: Booking/ezee/${bookingId}_${timestamp}.txt`);
      } else {
        console.error('Required fields not found in the response', insertResult);
      }

      console.log('Booked Ezee');
    }

    // Update booking with final status
    booking.booking_post_json = bookingPostJson;
    booking.booking_result_json = bookingResultJson;
    booking.transaction_id = transactionId;
    booking.affiliate_person = affiliatePerson;
    booking.pay_status = "Booking Done";
    booking.booking_by = "website";

    await submitBookingData({
      appName: "app3534482538357",
      moduleName: "bookings",
      body: {
        _id: bookingDoc._id,
        sectionData: { bookings: booking },
        companyId: bookingDoc.companyId,
      },
    });

    console.log(`Booking done ${payment_type || 'card'}:`, bid);
    return NextResponse.json({ status: 1 });
  } catch (error) {
    const err = error as Error;
    console.error('Change status error:', {
      message: err.message,
      stack: err.stack,
      line: err.stack?.split('\n')[1]?.trim()
    });
    return NextResponse.json({ 
      status: 'error', 
      message: err.message 
    }, { status: 500 });
  }
}
