import React from "react";

const DeleteModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null; // Don't render when hidden

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onCancel} // Click outside closes modal
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-sm w-full"
        onClick={(e) => e.stopPropagation()} // Prevent outside click closing
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-4 py-2">
          <h5 className="text-lg font-semibold">Confirm Delete</h5>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onCancel}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <p>Are you sure you want to delete?</p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t px-4 py-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
