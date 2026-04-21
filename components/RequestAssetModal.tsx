"use client";

import { useState } from "react";
import { Send, X } from "lucide-react";

type RequestAssetModalProps = {
  open: boolean;
  asset: any;
  onClose: () => void;
};

export default function RequestAssetModal({
  open,
  asset,
  onClose,
}: RequestAssetModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open || !asset) return null;

  async function handleSubmit() {
    setLoading(true);

    try {
      await fetch("/api/request-asset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset_id: asset.asset_id,
          asset_tag: asset.asset_tag,
          asset_name: asset.asset_name,
          reason,
        }),
      });

      alert("Asset request submitted!");
      onClose();
      setReason("");
    } catch {
      alert("Failed to submit request");
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold text-white">
            Request Asset
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 text-white"
          >
            <X size={18} />
          </button>

        </div>

        {/* Asset Info */}
        <div className="mb-5 text-white">

          <p className="font-semibold text-lg">
            {asset.asset_name}
          </p>

          <p className="text-sm opacity-70">
            {asset.asset_tag}
          </p>

        </div>

        {/* Reason */}
        <textarea
          rows={5}
          placeholder="Why do you need this asset?"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-gray-300 outline-none"
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-5 bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-2xl font-semibold flex items-center justify-center gap-2"
        >
          <Send size={18} />
          {loading ? "Submitting..." : "Submit Request"}
        </button>

      </div>
    </div>
  );
}