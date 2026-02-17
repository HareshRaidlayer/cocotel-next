"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/common/Header";
import SearchSubHeader from "@/components/common/subHeaderSearch";
import { useRouter } from "next/navigation";
import { fetchFromAPI, submitBookingData } from "@/lib/api";
import { getRoomPrice, isWeekend } from "@/utils/roomPrice";
import { ApiResponseItem, CompanyData, RoomApiItem } from "@/types/hotel";
import Swal from "sweetalert2";

interface BookingData {
  roomid: string;
  hotelid: string;
  noofroom: string;
  checkin: string;
  checkout: string;
  no_of_guests: string;
  noofchild: string;
  withbreakfast: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  popup?: string;
}

interface PaymentCalculation {
  nights: number;
  basePrice: number;
  breakfastCost: number;
  extraGuestCharge: number;
  subtotal: number;
  // taxAmount: number;
  // serviceFee: number;
  discount: number;
  gatewayCharges: number;
  total: number;
  savings: number;
  totalBeforePromo: number;
}

function BookingModal({
  open,
  onClose,
  initialData,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  initialData: BookingData;
  onSave: (data: BookingData) => void;
}) {
  const [formData, setFormData] = useState<BookingData>(initialData);
  const [error, setError] = useState<string>("");
  const [roomData, setRoomData] = useState<Record<string, unknown> | null>(null);


  const formatDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "";
    }
    return date.toISOString().split("T")[0];
  };

  const addDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };

  useEffect(() => {
    if (!open) return;

    const today = new Date();
    const todayStr = formatDate(today);
    const tomorrowStr = formatDate(addDays(today, 1));

    setFormData(prev => ({
      ...prev,
      checkin: prev.checkin || todayStr,
      checkout: prev.checkout || tomorrowStr,
    }));
  }, [open, initialData]);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const fetchRoomData = useCallback(async () => {
    try {
      const roomRes = await fetchFromAPI<Record<string, unknown>[]>({
        appName: "app3534482538357",
        moduleName: "rooms",
        query: {
          "_id": formData.roomid,
          "sectionData.rooms.is_deleted": "0",
        },
        limit: 1,
      });

      if (roomRes && roomRes.length > 0) {
        const roomSection = (roomRes[0] as Record<string, unknown>).sectionData as Record<string, unknown>;
        setRoomData((roomSection as Record<string, unknown>).rooms as Record<string, unknown>);
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  }, [formData.roomid]);

  useEffect(() => {
    if (open && formData.roomid) {
      fetchRoomData();
    }
  }, [open, formData.roomid, fetchRoomData]);

  const validateGuests = () => {
    if (roomData && roomData.max_adults) {
      const totalAdults = parseInt(formData.no_of_guests);
      const totalChildren = parseInt(formData.noofchild);
      const maxAdults = parseInt(roomData.max_adults as string);
      const maxChildren = parseInt((roomData.max_children as string) || '0');
      const extraPersonAllowed = parseInt((roomData.extraPerson as string) || '0');
      const maxAllowedGuests = maxAdults + extraPersonAllowed;

      if (totalAdults > maxAllowedGuests) {
        setError(`This room allows maximum ${maxAdults} adults + ${extraPersonAllowed} extra person (total ${maxAllowedGuests}). You have selected ${totalAdults} adults.`);
        return false;
      }

      if (totalChildren > maxChildren) {
        setError(`This room allows maximum ${maxChildren} children. You have selected ${totalChildren} children.`);
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleInputChange = (field: keyof BookingData, value: string) => {
    if (field === 'checkin') {
      const nextDay = formatDate(addDays(new Date(value), 1));
      setFormData(prev => ({
        ...prev,
        checkin: value,
        checkout: prev.checkout && prev.checkout > value ? prev.checkout : nextDay
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    if (field === 'no_of_guests' || field === 'noofchild') {
      setTimeout(validateGuests, 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateGuests()) return;

    if (typeof window !== "undefined") {
      localStorage.setItem("fname", formData.firstname ?? "");
      localStorage.setItem("lname", formData.lastname ?? "");
      localStorage.setItem("email", formData.email ?? "");
      localStorage.setItem("phone", formData.phone ?? "");
      localStorage.setItem("no_of_guests", formData.no_of_guests ?? "");
      localStorage.setItem("noofchild", formData.noofchild ?? "");
      localStorage.setItem("noofroom", formData.noofroom ?? "");

      console.log(" Booking data saved to localStorage", formData);
    }

    onSave(formData);
  };

  useEffect(() => {
    if (!open || typeof window === "undefined") return;

    const storedData: Partial<BookingData> = {
      firstname: localStorage.getItem("fname") || "",
      lastname: localStorage.getItem("lname") || "",
      email: localStorage.getItem("email") || "",
      phone: localStorage.getItem("phone") || "",
      no_of_guests: localStorage.getItem("no_of_guests") || initialData.no_of_guests,
      noofchild: localStorage.getItem("noofchild") || initialData.noofchild,
      noofroom: localStorage.getItem("noofroom") || initialData.noofroom,
    };

    setFormData(prev => ({
      ...prev,
      ...storedData,
    }));
  }, [open, initialData]);

  if (!open) return null;

  const today = new Date().toISOString().split("T")[0];
return (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg w-full max-w-3xl p-6 relative">
      <button
        onClick={onClose}
        className="absolute left-3 top-3 text-gray-500 hover:text-gray-800 flex items-center gap-2"
      >
        ← Back
      </button>

      <form onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold mb-4 mt-8">Booking Details</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            No of Rooms
          </label>
          <input
            type="number"
            min={1}
            max={500}
            required
            placeholder="No of Rooms"
            value={formData.noofroom}
            onChange={(e) => handleInputChange('noofroom', e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              No of Guests
            </label>
            <input
              type="number"
              min={1}
              max={
                roomData
                  ? Number(roomData.max_adults) +
                    Number(roomData.extraPerson || 0)
                  : 10
              }
              required
              placeholder="No of Guests"
              value={formData.no_of_guests}
              onChange={(e) =>
                handleInputChange('no_of_guests', e.target.value)
              }
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              No of Child
            </label>
            <input
              type="number"
              min={0}
              max={Number(roomData?.max_children) || 5}
              required
              placeholder="No of Child"
              value={formData.noofchild}
              onChange={(e) =>
                handleInputChange('noofchild', e.target.value)
              }
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Check-in Date
            </label>
            <input
              type="date"
              min={today}
              required
              value={formData.checkin}
              onChange={(e) =>
                handleInputChange('checkin', e.target.value)
              }
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Check-out Date
            </label>
            <input
              type="date"
              min={
                formData.checkin
                  ? formatDate(
                      addDays(new Date(formData.checkin), 1)
                    )
                  : today
              }
              required
              value={formData.checkout}
              onChange={(e) =>
                handleInputChange('checkout', e.target.value)
              }
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">
          Traveller Details
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              maxLength={32}
              required
              placeholder="First Name"
              value={formData.firstname || ''}
              onChange={(e) =>
                handleInputChange('firstname', e.target.value)
              }
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              maxLength={32}
              required
              placeholder="Last Name"
              value={formData.lastname || ''}
              onChange={(e) =>
                handleInputChange('lastname', e.target.value)
              }
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="Email"
              value={formData.email || ''}
              onChange={(e) =>
                handleInputChange('email', e.target.value)
              }
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              maxLength={16}
              required
              placeholder="Phone"
              value={formData.phone || ''}
              onChange={(e) =>
                handleInputChange('phone', e.target.value)
              }
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="submit"
            disabled={!!error}
            className="bg-green-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
);

  // return (
  //   <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
  //     <div className="bg-white rounded-lg w-full max-w-3xl p-6 relative">
  //       <button
  //         onClick={onClose}
  //         className="absolute left-3 top-3 text-gray-500 hover:text-gray-800 flex items-center gap-2"
  //       >
  //         ← Back
  //       </button>

  //       <form onSubmit={handleSubmit}>
  //         <h3 className="text-xl font-semibold mb-4 mt-8">Booking Details</h3>

  //         {error && (
  //           <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
  //             {error}
  //           </div>
  //         )}

  //         <div className="mb-4">
            
  //           <input
  //             type="number"
  //             min={1}
  //             max={500}
  //             required
  //             placeholder="No of Rooms"
  //             value={formData.noofroom}
  //             onChange={(e) => handleInputChange('noofroom', e.target.value)}
  //             className="border rounded px-3 py-2 w-full"
  //           />
  //         </div>

  //         <div className="grid grid-cols-2 gap-4 mb-4">
  //           <input
  //             type="number"
  //             min={1}
  //             max={roomData ? (Number(roomData.max_adults) + Number(roomData.extraPerson || 0)) : 10}
  //             required
  //             placeholder="No of Guests"
  //             value={formData.no_of_guests}
  //             onChange={(e) => handleInputChange('no_of_guests', e.target.value)}
  //             className="border rounded px-3 py-2"
  //           />
  //           <input
  //             type="number"
  //             min={0}
  //             max={Number(roomData?.max_children) || 5}
  //             required
  //             placeholder="No of Child"
  //             value={formData.noofchild}
  //             onChange={(e) => handleInputChange('noofchild', e.target.value)}
  //             className="border rounded px-3 py-2"
  //           />
  //         </div>

  //         <div className="grid grid-cols-2 gap-4 mb-6">
  //           <input
  //             type="date"
  //             min={today}
  //             required
  //             value={formData.checkin}
  //             onChange={(e) => handleInputChange('checkin', e.target.value)}
  //             className="border rounded px-3 py-2"
  //           />
  //           <input
  //             type="date"
  //             min={formData.checkin ? formatDate(addDays(new Date(formData.checkin), 1)) : today}
  //             required
  //             value={formData.checkout}
  //             onChange={(e) => handleInputChange('checkout', e.target.value)}
  //             className="border rounded px-3 py-2"
  //           />
  //         </div>

  //         <h3 className="text-xl font-semibold mb-4">Traveller Details</h3>

  //         <div className="grid grid-cols-2 gap-4">
  //           <input
  //             maxLength={32}
  //             required
  //             placeholder="First Name"
  //             value={formData.firstname || ''}
  //             onChange={(e) => handleInputChange('firstname', e.target.value)}
  //             className="border rounded px-3 py-2"
  //           />
  //           <input
  //             maxLength={32}
  //             required
  //             placeholder="Last Name"
  //             value={formData.lastname || ''}
  //             onChange={(e) => handleInputChange('lastname', e.target.value)}
  //             className="border rounded px-3 py-2"
  //           />
  //           <input
  //             type="email"
  //             required
  //             placeholder="Email"
  //             value={formData.email || ''}
  //             onChange={(e) => handleInputChange('email', e.target.value)}
  //             className="border rounded px-3 py-2"
  //           />
  //           <input
  //             maxLength={16}
  //             required
  //             placeholder="Phone"
  //             value={formData.phone || ''}
  //             onChange={(e) => handleInputChange('phone', e.target.value)}
  //             className="border rounded px-3 py-2"
  //           />
  //         </div>

  //         <div className="mt-6 text-center">
  //           <button
  //             type="submit"
  //             disabled={!!error}
  //             className="bg-green-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
  //           >
  //             Save
  //           </button>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  // );
}

interface PathBasedBookingPageProps {
  params: Promise<{
    locale: string;
    params: string[];
  }>;
}

export default function PathBasedBookingPage({ params }: PathBasedBookingPageProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [hotelData, setHotelData] = useState<CompanyData | null>(null);
  const [roomData, setRoomData] = useState<Record<string, unknown> | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [refundType, setRefundType] = useState<"refundable" | "nonrefundable">(
    "nonrefundable"
  );

  const [appliedPromo, setAppliedPromo] = useState<{ code: string, discount_in_percentage_weekday: number, discount_in_percentage_weekend: number, discount_in_price_weekday: number, discount_in_price_weekend: number, is_for_holiday: number } | null>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    roomid: '',
    hotelid: '',
    noofroom: '1',
    checkin: '',
    checkout: '',
    no_of_guests: '1',
    noofchild: '0',
    withbreakfast: '0'
  });
  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handleApplyPromo = async () => {
    if (!promoCode) {
       Swal.fire({
                icon: "info",
                title: "Info!",
                text: "Please enter a promo code",
                // confirmButtonText: "OK",
              });
     // alert("Please enter a promo code");
      return;
    }

    try {
      const response = await fetch("/api/promocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promocode: promoCode,
          hotelid: bookingData.hotelid,
          roomid: bookingData.roomid,
          checkin: bookingData.checkin,
          checkout: bookingData.checkout,
          noofday: payment.nights,
          email: bookingData.email,
        }),
      });

      const result = await response.json();
      console.log('Promo Code Result:', result);
      if (result.status === 1) {
        setAppliedPromo({
          code: promoCode,
          ...result.data,
        });
        Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Promo code applied successfully!",
                // confirmButtonText: "OK",
              });
        //alert("Promocode applied successfully!");
      } else {
      Swal.fire({
                icon: "error",
                title: "Oops!",
                text: result.message,
                // confirmButtonText: "OK",
              });
       // alert(result.message);
        setPromoCode("");
      }
    } catch (error) {
      Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Failed to apply promo code",
                // confirmButtonText: "OK",
              });
     // console.error("Promo code error:", error);
      alert("Failed to apply promo code");
    }
  };

  const handleProceedPayment = async () => {
    if (!selectedPaymentMethod) return;

    try {
      // Check room availability
      const availabilityResponse = await fetch("/api/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkin: bookingData.checkin,
          checkout: bookingData.checkout,
          hotelid: bookingData.hotelid,
          roomid: bookingData.roomid,
          noofguest: bookingData.no_of_guests,
          noofchild: bookingData.noofchild,
          noofroom: bookingData.noofroom
        })
      });

      const availabilityResult = await availabilityResponse.json();

      if (!availabilityResponse.ok || !availabilityResult.success) {
        alert(availabilityResult.error || "Room not available. Please choose different dates.");
        return;
      }

      // Room available, save booking
      const nightDates = getNightDates(bookingData.checkin, bookingData.checkout);
      const roomInfo = nightDates.map(date => ({
        date: date.toISOString().split('T')[0],
        price: getRoomPrice(roomData!, date),
        room_name: roomData?.title || "",
        guests: bookingData.no_of_guests,
        rooms: bookingData.noofroom
      }));

      const bookingId = `BK-${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(new Date().getHours()).padStart(2, '0')}${String(new Date().getMinutes()).padStart(2, '0')}${String(new Date().getSeconds()).padStart(2, '0')}${Math.floor(Math.random() * 100)}`;

      const bookingPayload = {
        booking_id: bookingId,
        hotel_id: bookingData.hotelid,
        hotel_code: hotelData?.web_hotel_code || "",
        hotel_name: hotelData?.web_title || hotelData?.name || "",
        room_type_id: bookingData.roomid,
        room_type_code: roomData?.room_code || "",
        room_type_name: roomData?.title || "",
        room_type_amount: payment.basePrice,
        first_name: bookingData.firstname || "",
        last_name: bookingData.lastname || "",
        email: bookingData.email || "",
        phone: bookingData.phone || "",
        amount: finalPayable,
        no_of_days: payment.nights,
        no_of_guests: bookingData.no_of_guests,
        no_of_rooms: bookingData.noofroom,
        is_breakfast: bookingData.withbreakfast,
        refundable: refundType === "refundable" ? 1 : 0,
        method: selectedPaymentMethod,
        promocode: appliedPromo?.code || null,
        booking_date: new Date().toISOString().split('T')[0],
        arrival_date_app: bookingData.checkin,
        departure_date_app: bookingData.checkout,
        pay_status: "Pending",
        RoomInfo: roomInfo
      };

      const result = await submitBookingData({
        appName: "app3534482538357",
        moduleName: "bookings",
        body: {
          sectionData: {
            bookings: bookingPayload
          },
          companyId: bookingData.hotelid
        }
      });

      if (result.success) {
        if (selectedPaymentMethod === "Creditcard") {
          const formattedAmount = Number(finalPayable).toFixed(2);
          console.log('paymentcard:', bookingId, formattedAmount);
          router.push(
            `/creditcard?bookingid=${bookingId}&amount=${formattedAmount}`
          );
        }

        if (selectedPaymentMethod === "GCASH") {
          const formattedAmount = Number(finalPayable).toFixed(2);
          console.log('paymentgacsh:', bookingId, formattedAmount);
          router.push(
            `/gcash?bookingid=${bookingId}&amount=${formattedAmount}&PH_GCASH=1`
          );
        }

      } else {
        alert("Failed to create booking. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to process booking. Please try again.");
    }
  };

  const formatFullDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const initializeBooking = async () => {
      const { params: routeParams } = await params;

      let extractedData: BookingData = {
        roomid: '',
        hotelid: '',
        noofroom: '1',
        checkin: '',
        checkout: '',
        no_of_guests: '1',
        noofchild: '0',
        withbreakfast: '0'
      };

      if (routeParams.length === 9) {
        const [roomid, hotelid, noofroom, checkin, checkout, no_of_guests, noofchild, withbreakfast, popup] = routeParams;
        extractedData = {
          roomid, hotelid, noofroom, checkin, checkout,
          no_of_guests, noofchild, withbreakfast, popup
        };
        if (popup === '1') setShowModal(true);
      } else if (routeParams.length === 8) {
        const [roomid, hotelid, noofroom, checkin, checkout, no_of_guests, noofchild, withbreakfast] = routeParams;
        extractedData = {
          roomid, hotelid, noofroom, checkin, checkout,
          no_of_guests, noofchild, withbreakfast, popup: '1'
        };
        setShowModal(true);
      } else if (routeParams.length === 13) {
        const [roomid, hotelid, noofroom, checkin, checkout, no_of_guests, noofchild, withbreakfast, firstname, lastname, email, phone] = routeParams;
        extractedData = {
          roomid, hotelid, noofroom, checkin, checkout,
          no_of_guests, noofchild, withbreakfast,
          firstname, lastname, email: decodeURIComponent(email), phone, popup: '0'
        };
      } else if (routeParams.length === 14) {
        const [roomid, hotelid, noofroom, checkin, checkout, no_of_guests, noofchild, withbreakfast, firstname, lastname, email, phone, popup] = routeParams;
        extractedData = {
          roomid, hotelid, noofroom, checkin, checkout,
          no_of_guests, noofchild, withbreakfast,
          firstname, lastname, email: decodeURIComponent(email), phone, popup
        };
        if (popup === '1') setShowModal(true);
      }

      setBookingData(extractedData);

      if (extractedData.roomid && extractedData.hotelid) {
        fetchHotelAndRoomData(extractedData.roomid, extractedData.hotelid);
      }
    };

    initializeBooking();
  }, [params]);

  const fetchHotelAndRoomData = async (roomid: string, hotelid: string) => {
    // Skip API calls if we already have the data
    if (hotelData && roomData) return;

    try {
      console.log("Fetching hotel data for hotelid:", hotelid);
      console.log("Fetching room data for roomid:", roomid);

      const [hotelResponse, roomResponse] = await Promise.all([
        fetchFromAPI<ApiResponseItem[]>({
          appName: "app3534482538357",
          moduleName: "company",
          query: {
            "_id": hotelid,
          },
          limit: 1,
        }),
        fetchFromAPI<Record<string, unknown>[]>({
          appName: "app3534482538357",
          moduleName: "rooms",
          query: {
            "_id": roomid,
          },
          limit: 1,
        })
      ]);

      console.log("Hotel Response:", JSON.stringify(hotelResponse, null, 2));
      console.log("Room Response:", JSON.stringify(roomResponse, null, 2));
      if (hotelResponse && hotelResponse.length > 0) {
        console.log("Setting hotel data:", hotelResponse[0].sectionData.Company);
        setHotelData(hotelResponse[0].sectionData.Company);
      } else {
        console.log("No hotel data found");
      }

      if (roomResponse && roomResponse.length > 0) {
        const roomSection = (roomResponse[0] as Record<string, unknown>).sectionData as Record<string, unknown>;
        const roomInfo = roomSection.rooms as Record<string, unknown>;
        console.log("Setting room data:", roomInfo);
        setRoomData(roomInfo);
      } else {
        console.log("No room data found");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    router.back();
  };

  const handleSave = (data: BookingData) => {
    const pathUrl = `/ph/${bookingData.roomid}/${bookingData.hotelid}/${data.noofroom}/${data.checkin}/${data.checkout}/${data.no_of_guests}/${data.noofchild}/${data.withbreakfast}/${data.firstname || ''}/${data.lastname || ''}/${encodeURIComponent(data.email || '')}/${data.phone || ''}/0`;

    router.push(pathUrl);
    setShowModal(false);
    setBookingData(data);
  };
  const getNightDates = (checkin: string, checkout: string): Date[] => {
    const dates: Date[] = [];
    if (!checkin || !checkout) return dates;

    const current = new Date(checkin);
    const end = new Date(checkout);

    while (current < end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };



  const calculatePayment = (): PaymentCalculation => {
    if (!roomData) {
      return {
        nights: 0,
        basePrice: 0,
        breakfastCost: 0,
        extraGuestCharge: 0,
        subtotal: 0,
        discount: 0,
        gatewayCharges: 0,
        total: 0,
        savings: 0,
        totalBeforePromo: 0,
      };
    }

    const rooms = Number(bookingData.noofroom) || 1;
    const nightDates = getNightDates(bookingData.checkin, bookingData.checkout);
    const nightsCount = nightDates.length;

    // Calculate original price and discount separately
    let originalRoomPrice = 0;
    let totalDiscount = 0;

    nightDates.forEach(date => {
      const dayPrice = getRoomPrice(roomData, date);
      originalRoomPrice += dayPrice * rooms;

      if (appliedPromo) {
        const isWeekendDay = isWeekend(date);
        // Note: Holiday check would require async call, skipping for now
        // In PHP, holidays are checked and is_for_holiday flag determines if promo applies
        // For simplicity, we apply promo based on weekend/weekday only
        if (isWeekendDay) {
          if (appliedPromo.discount_in_price_weekend > 0) {
            totalDiscount += appliedPromo.discount_in_price_weekend * rooms;
          } else if (appliedPromo.discount_in_percentage_weekend > 0) {
            totalDiscount += (dayPrice * appliedPromo.discount_in_percentage_weekend / 100) * rooms;
          }
        } else {
          if (appliedPromo.discount_in_price_weekday > 0) {
            totalDiscount += appliedPromo.discount_in_price_weekday * rooms;
          } else if (appliedPromo.discount_in_percentage_weekday > 0) {
            totalDiscount += (dayPrice * appliedPromo.discount_in_percentage_weekday / 100) * rooms;
          }
        }
      }
    });

    const basePrice = originalRoomPrice - totalDiscount;

    // Extra guest calculation
    const guests = Number(bookingData.no_of_guests) || 1;
    const maxAdults = Number(roomData.max_adults || 2);
    const extraGuests = Math.max(0, guests - maxAdults);
    const extraGuestRate = Number(roomData.extraPersonPrice || 500);
    const extraGuestCharge = extraGuests * extraGuestRate * nightsCount;

    // Breakfast
    const withBreakfast = Number(bookingData.withbreakfast) || 0;
    const breakfastPrice = Number(roomData.breakfast_price || 200);
    const breakfastCost = withBreakfast ? breakfastPrice * guests * nightsCount : 0;

    // Subtotal
    const subtotal = basePrice + breakfastCost + extraGuestCharge;

    // Gateway charges (on discounted base price)
    const gatewayCharges = (basePrice * 3.6) / 100;

    // Total
    const total = subtotal + gatewayCharges;

    // Calculate total before promo (for savings calculation)
    const originalSubtotal = originalRoomPrice + breakfastCost + extraGuestCharge;
    const originalGatewayCharges = (originalRoomPrice * 3.6) / 100;
    const totalBeforePromo = originalSubtotal + originalGatewayCharges;

console.log("Payment Calculation Details:", {nightsCount, originalRoomPrice, totalDiscount, basePrice, breakfastCost, extraGuestCharge, subtotal, gatewayCharges, total });
    return {
      nights: nightsCount,
      basePrice,
      breakfastCost,
      extraGuestCharge,
      subtotal,
      discount: totalDiscount,
      gatewayCharges,
      total,
      savings: totalBeforePromo - total,
      totalBeforePromo,
    };
  };



  const formatCurrency = (amount: number): string => {
    return `₱ ${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };



  const payment = calculatePayment();
  const baseTotal = payment.total;
  const REFUND_PERCENT = 8;

  const calculateRefundFee = (amount: number) => {
    return Number(((amount * REFUND_PERCENT) / 100).toFixed(2));
  };

  const refundFee =
    refundType === "refundable"
      ? calculateRefundFee(baseTotal)
      : 0;

  const finalPayable =
    refundType === "refundable"
      ? baseTotal + refundFee
      : baseTotal;

  return (
    <div className="min-h-screen bg-green-50">
      <Header />
      <SearchSubHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Order details</h1>
        <p className="text-gray-600 mt-1">
          This details to send e-ticket and refund or reschedule needs
        </p>

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <p className="text-gray-900">{bookingData.firstname || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <p className="text-gray-900">{bookingData.lastname || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{bookingData.email || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{bookingData.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-red-500">
              <h2 className="text-2xl font-bold">{(roomData?.title as string) || 'Loading room...'}</h2>

              {roomData?.description && typeof roomData.description === 'string' ? (
                <div className="mt-4 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: roomData.description as string }} />
              ) : null}

              <div className="flex justify-between border-t mt-6 pt-4 text-sm">
                <span>Guest : <strong>{bookingData.no_of_guests}</strong></span>
                <span>Rooms : <strong>{bookingData.noofroom}</strong></span>
                <span>Children : <strong>{bookingData.noofchild}</strong></span>
                <span>Max Adults : <strong>{(roomData?.max_adults as string) || 'N/A'}</strong></span>
                <span>Extra Person : <strong>{(roomData?.extraPerson as string) || '0'}</strong></span>
              </div>
            </div>

            {/* <div className="bg-white rounded-lg shadow p-6 border border-green-500">
              <h2 className="text-2xl font-bold">Total Payment Summary</h2>
              <div className="mt-4 text-green-600 text-3xl font-bold">
                {formatCurrency(payment.total)}
              </div>
              <p className="text-sm text-gray-500">Incl. of all taxes</p>
            </div> */}
            {/* PAYMENT SUMMARY */}
            <div className="bg-white rounded-lg shadow p-6 border border-green-500">
              <h2 className="text-2xl font-bold">Total Payment Summary</h2>

              <div className="mt-4 text-green-600 text-3xl font-bold">
                {formatCurrency(finalPayable)}
                {/* //{formatCurrency(payment.total)} */}
              </div>
              <p className="text-sm text-gray-500">Incl. of all taxes</p>

              {/* Promo Code Section */}
              <div className="mt-4">
                <div className="flex gap-4">
                  <input
                    placeholder="PROMO CODE"
                    value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    // onChange={(e) => setPromoCode(e.target.value)}
                    className="border rounded px-3 py-2 flex-1"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="bg-green-600 text-white px-6 rounded hover:bg-green-700"
                  >
                    Apply
                  </button>
                </div>

                {appliedPromo && (
                  <div className="mt-2 flex justify-between items-center text-sm">
                    <span className="text-green-600">✓ {appliedPromo.code} applied</span>
                    <button
                      onClick={() => { setAppliedPromo(null); setPromoCode(''); }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {payment.discount > 0 && (
                  <div className="mt-2 p-2 bg-green-50 rounded">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700 font-medium">Your Savings</span>
                      <span className="text-green-700 font-bold">{formatCurrency(payment.savings)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Promo Code Details - Only shown when promo is applied */}
              {appliedPromo && payment.discount > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-bold text-lg mb-3">Promo Code Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Promo Code</span>
                      <span className="font-bold text-blue-600">{appliedPromo.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Discount Promo</span>
                      <span className="font-semibold text-green-600">{formatCurrency(payment.discount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Room Price Before Discount</span>
                      <span>{formatCurrency(payment.basePrice + payment.discount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Room Price After Discount</span>
                      <span className="font-semibold">{formatCurrency(payment.basePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>3.6 %</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax Amount</span>
                      <span>{formatCurrency(payment.gatewayCharges)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                      <span>Total room with promo after tax</span>
                      <span className="text-green-600">{formatCurrency(payment.basePrice + payment.gatewayCharges)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Breakdown */}
              <div className="mt-6 text-sm space-y-2 border-t pt-4">
                {/* {getNightDates(bookingData.checkin, bookingData.checkout).map((date, idx) => (
  <div key={idx} className="flex justify-between">
    <span>{date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })}</span>

    <span>
      {formatCurrency(
        Number(roomData?.rate_week_day_peak || roomData?.rate || 0) *
        Number(bookingData.noofroom)
      )}
    </span>
  </div>
))} */}
                {roomData && bookingData.checkin && bookingData.checkout && (
                  getNightDates(bookingData.checkin, bookingData.checkout).map((date, idx) => {
                    const dayPrice = getRoomPrice(roomData, date);

                    return (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {date.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span>{formatCurrency(dayPrice)}</span>
                      </div>
                    );
                  })
                )}





                <div className="flex justify-between text-xs text-gray-600">
                  <span>{payment.nights} nights × {bookingData.noofroom} room(s)</span>
                  <span>{formatCurrency(payment.basePrice + payment.discount)}</span>
                </div>

                {payment.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span>-{formatCurrency(payment.discount)}</span>
                  </div>
                )}

                {payment.breakfastCost > 0 && (
                  <div className="flex justify-between">
                    <span>Breakfast ({parseInt(bookingData.no_of_guests) + parseInt(bookingData.noofchild)} persons × {payment.nights} nights)</span>
                    <span>{formatCurrency(payment.breakfastCost)}</span>
                  </div>
                )}

                {payment.extraGuestCharge > 0 && (
                  <div className="flex justify-between">
                    <span>Extra Person Charges ({Math.max(0, parseInt(bookingData.no_of_guests) - parseInt((roomData?.max_adults as string) || '2'))} person × {payment.nights} nights × ₱{Number(roomData?.extraPersonPrice) || 500})</span>
                    <span>{formatCurrency(payment.extraGuestCharge)}</span>
                  </div>
                )}

                <div className="flex justify-between border-t pt-2">
                  <span>Subtotal</span>
                  <span>{formatCurrency(payment.subtotal + payment.discount)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Payment Gateway Charges</span>
                  <span>{formatCurrency(payment.gatewayCharges)}</span>
                </div>

                <div className="flex justify-between font-bold text-lg text-green-700 border-t pt-3">
                  <span>Total Payment</span>
                  <span>{formatCurrency(finalPayable)}</span>
                </div>

                <p className="text-xs text-gray-500 mt-2">(incl. of all taxes)</p>
              </div>
            </div>

            {/* REFUNDABLE */}
            {/* <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Refundable Booking</h2>

              <label className="flex items-center gap-3 border p-4 rounded cursor-pointer">
                <input type="radio" name="refund" defaultChecked />
                <div>
                  <p className="font-semibold">Refundable Booking</p>
                  <p className="text-sm text-gray-500">
                    Added Fee to Room Price
                  </p>
                </div>
                <span className="ml-auto font-bold">$0.0</span>
              </label>

              <label className="flex items-center gap-3 border p-4 rounded cursor-pointer mt-3">
                <input type="radio" name="refund" />
                <p className="font-semibold">Non-refundable Booking</p>
              </label>
            </div> */}
            {/* REFUND SECTION */}
            <div className="bg-white rounded-lg shadow p-6">
              {/* Header */}
              <div className="mb-4">
                <p className="text-2xl font-bold text-center md:text-left">
                  Refundable Booking
                </p>
                <p className="text-gray-500 text-sm text-center md:text-left">
                  Select options that you preferred
                </p>
              </div>

              {/* Country restriction */}
              {hotelData?.country_id === '2' && (
                <p className="text-red-600 mb-3">
                  Refundable Booking is not available for Indonesia.
                </p>
              )}

              {/* Refundable Option */}
              <label
                className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer ${refundType === 'refundable'
                    ? 'border-blue-500 bg-blue-50'
                    : ''
                  }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="refund"
                    checked={refundType === 'refundable'}
                    disabled={hotelData?.country_id === '2'}
                    onChange={() => setRefundType('refundable')}
                  />
                  <div>
                    <p className="font-semibold">Refundable Booking</p>
                    <p className="text-sm text-gray-500">
                      Added Fee to Room Price
                    </p>
                  </div>
                </div>

                <span className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full">
                  Recommended
                </span>
              </label>

              {/* Fee Row */}
              <div className="flex justify-between mt-3 text-sm text-gray-600 pl-6">
                <span>Added Fee to Room Price (8%)</span>
                <span className="font-semibold">
                  {refundType === "refundable"
                    ? formatCurrency(refundFee)
                    : formatCurrency(0)}
                </span>
              </div>


              {/* COVID Coverage */}
              <div className="mt-4 bg-green-500 text-white rounded-full px-4 py-2 text-sm">
                ✓ <b>COVID-19</b> infection & isolation –{" "}
                <a href="#" className="underline">
                  See details
                </a>
              </div>

              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-3 mt-4 text-sm text-gray-700">
                {[
                  "Sickness, Accident, Injury",
                  "Home Emergency",
                  "Pre-existing medical conditions",
                  "Public Transport Failure",
                  "Theft of Documents",
                  "Court Summons",
                  "Private Vehicle Failure",
                  "Emergency Services Recall",
                  "And many more...",
                ].map((item, i) => (
                  <p key={i}>✓ {item}</p>
                ))}
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500 mt-4">
                Upgrade your booking and receive a 100% refund if you cannot attend
                and can evidence one of the many reasons in our{" "}
                <a href="#" className="text-green-600 underline">
                  Terms and Conditions
                </a>
                .
              </p>

              {/* Non-refundable */}
              <label
                className={`flex items-center gap-3 border rounded-lg p-4 mt-4 cursor-pointer ${refundType === 'nonrefundable'
                    ? 'border-gray-500 bg-gray-50'
                    : ''
                  }`}
              >
                <input
                  type="radio"
                  name="refund"
                  checked={refundType === 'nonrefundable'}
                  onChange={() => setRefundType('nonrefundable')}
                />
                <p className="font-semibold">Non-refundable Booking</p>
              </label>
            </div>

            {/* PAYMENT METHOD */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Payment Method</h2>

              <label className="flex items-center gap-3 border p-4 rounded cursor-pointer">
                <input type="radio" name="pay" value="Creditcard" onChange={(e) => handlePaymentMethodChange(e.target.value)} />
                <p className="font-semibold">Credit / Debit Card</p>
              </label>

              <label className="flex items-center gap-3 border p-4 rounded cursor-pointer mt-3">
                <input type="radio" name="pay" value="GCASH" onChange={(e) => handlePaymentMethodChange(e.target.value)} />
                <p className="font-semibold">GCash</p>
              </label>

              <button
                onClick={handleProceedPayment}
                disabled={!selectedPaymentMethod}
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 hover:bg-green-700"
              >
                Proceed to Payment
              </button>
            </div>
          </div>

          <aside className="bg-white rounded-lg shadow p-6 h-fit sticky top-6">
            {/* Hotel Name */}
            <h3 className="font-bold text-lg">
              {hotelData?.web_title || hotelData?.companyName || "Loading hotel..."}
            </h3>

            {/* Date Range */}
            <p className="text-sm text-gray-600 mt-2">
              {bookingData.checkin && bookingData.checkout && (
                <>
                  {formatFullDate(bookingData.checkin)} -{" "}
                  {formatFullDate(bookingData.checkout)}
                </>
              )}
            </p>

            {/* Nights & Bed */}
            <div className="flex gap-6 text-sm text-gray-700 mt-3">
              <span>
                Nights : {payment.nights}
              </span>
              <span>
                Bed : {(roomData?.beds as string) || 1}
              </span>
            </div>

            {/* Divider */}
            <hr className="my-4" />

            {/* Total */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Total (After tax)
              </p>

              <span className="text-black-500 text-xl font-bold">
                {formatCurrency(finalPayable)}
              </span>
            </div>

          </aside>
        </div>
      </main>

      <BookingModal
        open={showModal}
        onClose={handleClose}
        initialData={bookingData}
        onSave={handleSave}
      />
    </div>
  );
}