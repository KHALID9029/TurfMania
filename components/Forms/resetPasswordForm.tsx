"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

interface ResetPasswordFormProps {
  userId: number;
  onClose: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ userId, onClose }) => {
  const [prevPassword, setPrevPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.set("prevPassword", prevPassword);
      data.set("newPassword", newPassword);

      const res = await fetch(`/api/users?resetPassword=true&id=${userId}`, {
        method: "PUT",
        body: data,
      });

      if (!res.ok) {
        const errData = await res.json();
        toast.error(errData?.error || "Failed to reset password.");
      } else {
        toast.success("Password updated successfully!");
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Previous Password</label>
        <input
          type="password"
          value={prevPassword}
          onChange={(e) => setPrevPassword(e.target.value)}
          className="w-full bg-zinc-800 p-2 rounded text-white border border-zinc-700 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full bg-zinc-800 p-2 rounded text-white border border-zinc-700 focus:outline-none"
          required
          minLength={6}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full bg-zinc-800 p-2 rounded text-white border border-zinc-700 focus:outline-none"
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;