import { useState } from 'react';
import { useGetBookingUpdateQuery, useUpdateBookingStatusMutation } from "@/features/owner/ownerApi"
import { X, Eye, ChevronLeft, ChevronRight, Calendar, CreditCard, Clock, Building } from 'lucide-react';
import type { OwnerBookingItem, Pagination } from '../types/owner.type';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const OwnerBookings = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useGetBookingUpdateQuery({ page, limit } , {
    pollingInterval : 10000 
  });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<OwnerBookingItem | null>(null);

  const bookings: OwnerBookingItem[] = data?.booking || [];
  const pagination: Pagination = data?.pagination || ({} as Pagination);

  const handleStatusAction = async (bookingId: string, newStatus: string) => {
    try {
      await updateStatus({ bookingId, status: newStatus }).unwrap();

      if (selectedBooking && selectedBooking._id === bookingId) {
        setSelectedBooking({ ...selectedBooking, bookingStatus: newStatus });
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const openDetailsModal = (booking: OwnerBookingItem) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'rejected': return 'bg-rose-50 text-rose-700 border-rose-200/60';
      case 'cancelled': return 'bg-stone-100 text-stone-600 border-stone-200/60';
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200/60';
      default: return 'bg-stone-50 text-stone-600 border-stone-200/60';
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C29F47]"></div>
    </div>
  );

  if (isError) return (
    <div className="p-6 text-center bg-rose-50 rounded-xl border border-rose-100 text-rose-600 font-medium max-w-2xl mx-auto mt-6">
      Error: {(error as any)?.data?.message || 'Failed to load bookings'}
    </div>
  );

  return (
    <div className="w-full font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2B1343] tracking-tight">Booking Management</h1>
        <p className="text-sm text-[#5F5665] mt-1">Review customer schedules, update venue parameters, and manage confirmation pipelines.</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#F3EFE9] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#FCFBF9] border-b border-[#F3EFE9] text-[11px] font-bold text-[#5F5665] uppercase tracking-wider">
                <th className="p-4.5 font-semibold">Customer</th>
                <th className="p-4.5 font-semibold">Venue Details</th>
                <th className="p-4.5 font-semibold">Payment Info</th>
                <th className="p-4.5 font-semibold">Status</th>
                <th className="p-4.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3EFE9] text-[14px] text-[#5F5665]">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-stone-400">
                    <Calendar className="w-10 h-10 mx-auto text-stone-300 mb-2.5" />
                    <p className="text-sm font-semibold text-[#2B1343]">No bookings found</p>
                    <p className="text-xs text-stone-400 mt-0.5">Incoming user request pipelines are empty.</p>
                  </td>
                </tr>
              ) : (
                bookings.map((item) => (
                  <tr key={item._id} className="hover:bg-[#FCFBF9]/40 transition-colors">
                    <td className="p-4.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#F5EFE4] flex items-center justify-center text-[#C29F47] font-bold shrink-0 text-xs">
                          {item.userId?.userName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-[#2B1343]">{item.userId?.userName || 'Anonymous'}</div>
                          <div className="text-[12px] text-stone-400 font-normal">{item.userId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4.5">
                      <div className="font-semibold text-stone-800">{item.venueId?.venueName}</div>
                      <div className="text-[12px] text-stone-400 flex items-center gap-1 mt-0.5">
                        <Building size={12} className="text-[#C29F47]" />
                        <span className="capitalize">{item.venueId?.category}</span>
                      </div>
                    </td>
                    <td className="p-4.5">
                      <div className="font-bold text-stone-800">₹{item.totalAmount?.toLocaleString('en-IN') || '0'}</div>
                      <div className="text-[12px] text-stone-400 capitalize mt-0.5 flex items-center gap-1">
                        <CreditCard size={12} className="text-[#C29F47]" />
                        {item.paymentType || 'Full'}
                      </div>
                    </td>
                    <td className="p-4.5">
                      <Select
                        disabled={isUpdating}
                        value={item.bookingStatus}
                        onValueChange={(val) => handleStatusAction(item._id, val)}
                      >
                        <SelectTrigger className={`w-[125px] h-8.5 text-xs font-semibold rounded-xl border transition ${getBadgeColor(item.bookingStatus)}`}>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-[#F3EFE9]">
                          <SelectItem value="pending" className="text-xs font-medium">Pending</SelectItem>
                          <SelectItem value="approved" className="text-emerald-700 font-medium text-xs">Approve</SelectItem>
                          <SelectItem value="rejected" className="text-rose-700 font-medium text-xs">Reject</SelectItem>
                          <SelectItem value="completed" className="text-blue-700 font-medium text-xs">Completed</SelectItem>
                          <SelectItem value="cancelled" className="text-stone-500 font-medium text-xs">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4.5 text-right">
                      <button
                        onClick={() => openDetailsModal(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#C29F47] bg-[#F5EFE4] hover:bg-[#ebd9bd] rounded-xl transition-colors border border-[#ebd9bd]/20"
                      >
                        <Eye size={13} /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="p-4 bg-[#FCFBF9] border-t border-[#F3EFE9] flex items-center justify-between text-xs font-medium text-[#5F5665]">
            <span>Showing page {page} of {pagination.totalPages}</span>
            <div className="flex gap-1.5">
              <button
                disabled={!pagination.hasPreviousPage}
                onClick={() => setPage((prev) => prev - 1)}
                className="p-1.5 border border-[#F3EFE9] rounded-xl bg-white text-[#5F5665] hover:bg-stone-50 disabled:opacity-40 transition shadow-xs"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((prev) => prev + 1)}
                className="p-1.5 border border-[#F3EFE9] rounded-xl bg-white text-[#5F5665] hover:bg-stone-50 disabled:opacity-40 transition shadow-xs"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && selectedBooking && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-[#2B1343]/20 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl border border-[#F3EFE9] shadow-xl max-w-xl w-full overflow-hidden transform transition-all animate-in zoom-in-95 duration-150"
          >

            <div className="px-6 py-5 border-b border-[#F3EFE9] flex justify-between items-center bg-[#FCFBF9]">
              <div>
                <h3 className="text-base font-bold text-[#2B1343] tracking-tight">Reservation Breakdown</h3>
                <p className="text-[11px] text-stone-400 font-mono mt-0.5">REF_ID: {selectedBooking._id}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-xl border border-[#F3EFE9] bg-white text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition shadow-xs"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-6 space-y-5 text-[14px] text-[#5F5665] max-h-[68vh] overflow-y-auto">

              <div className="grid grid-cols-2 gap-4 border-b border-[#F3EFE9] pb-4">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Venue Name</span>
                  <p className="font-bold text-[#2B1343] mt-0.5">{selectedBooking.venueId?.venueName || 'N/A'}</p>
                  <p className="text-xs text-stone-400 font-medium capitalize mt-0.5">{selectedBooking.venueId?.category}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Processing Status</span>
                  <div className="mt-1">
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-lg border inline-block tracking-wide capitalize ${getBadgeColor(selectedBooking.bookingStatus)}`}>
                      {selectedBooking.bookingStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-b border-[#F3EFE9] pb-4">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Customer Specifications</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 text-stone-700">
                  <p className="text-sm"><span className="text-stone-400">Name:</span> <span className="font-semibold text-stone-800">{selectedBooking.userId?.userName || 'Anonymous'}</span></p>
                  <p className="text-sm"><span className="text-stone-400">Email Hub:</span> <span className="font-medium text-stone-800">{selectedBooking.userId?.email || 'N/A'}</span></p>
                  <p className="text-sm md:col-span-2"><span className="text-stone-400">Phone Contact:</span> <span className="font-medium text-stone-800">{selectedBooking.userId?.phoneNumber || 'Not Provided'}</span></p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-[#F3EFE9] pb-4">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Event Date</span>
                  <div className="flex items-center gap-1.5 text-stone-800 font-semibold mt-1">
                    <Calendar size={13} className="text-[#C29F47]" />
                    {new Date(selectedBooking.bookingDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Timeline Parameter</span>
                  <div className="flex items-center gap-1.5 text-stone-800 font-semibold mt-1 capitalize">
                    <Clock size={13} className="text-[#C29F47]" />
                    {selectedBooking.bookingType === 'hourly' ? 'Hourly Allocation' : 'Full Day Structure'}
                  </div>
                </div>
              </div>

              <div className="bg-[#FCFBF9] border border-[#F3EFE9] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Financial Model</span>
                  <span className="text-[12px] font-semibold text-[#C29F47] bg-[#F5EFE4] px-2 py-0.5 rounded-lg border border-[#ebd9bd]/20 mt-1 inline-block capitalize">
                    {selectedBooking.paymentType || 'Full'} Invoicing
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-stone-400 block">Total Booked Rate</span>
                  <span className="text-xl font-bold text-[#2B1343]">
                    ₹{(selectedBooking.totalAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>



            </div>

            <div className="px-6 py-4 bg-[#FCFBF9] border-t border-[#F3EFE9] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5F5665] bg-white border border-[#F3EFE9] rounded-xl hover:bg-stone-50 transition"
              >
                Close
              </button>

              {selectedBooking.bookingStatus === 'pending' && (
                <>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => {
                      handleStatusAction(selectedBooking._id, 'rejected');
                      setIsModalOpen(false);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-100 rounded-xl transition disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => {
                      handleStatusAction(selectedBooking._id, 'approved');
                      setIsModalOpen(false);
                    }}
                    className="px-4 py-2 bg-[#C29F47] hover:bg-[#b08f3d] text-white rounded-xl text-xs font-semibold shadow-xs transition disabled:opacity-50"
                  >
                    Approve Booking
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerBookings;
