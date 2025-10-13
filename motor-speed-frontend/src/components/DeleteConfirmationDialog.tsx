import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  readingsCount: number;
}

export default function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  readingsCount,
}: DeleteConfirmationDialogProps) {
  const [step, setStep] = useState<"warning" | "passkey" | "final">("warning");
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  const ADMIN_PASSKEY = import.meta.env.VITE_ADMIN_PASSKEY || "motor2025";

  const handleClose = () => {
    setStep("warning");
    setPasskey("");
    setError("");
    onClose();
  };

  const handleWarningConfirm = () => {
    setStep("passkey");
    setError("");
  };

  const handlePasskeySubmit = () => {
    if (passkey === ADMIN_PASSKEY) {
      setStep("final");
      setError("");
    } else {
      setError("❌ Invalid passkey. Please try again.");
      setPasskey("");
    }
  };

  const handleFinalConfirm = () => {
    handleClose();
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {/* Step 1: Warning */}
        {step === "warning" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <span className="text-2xl">⚠️</span>
                <span>Delete All Motor Readings?</span>
              </DialogTitle>
              <DialogDescription className="text-left pt-4">
                <div className="space-y-3">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    This action will permanently delete:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    <li>
                      <strong>{readingsCount}</strong> motor readings
                    </li>
                    <li>All historical data and charts</li>
                    <li>All analytics and reports</li>
                    <li>All machine performance history</li>
                  </ul>
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                      ⚠️ This action cannot be undone!
                    </p>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleWarningConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Continue to Security Check
              </button>
            </DialogFooter>
          </>
        )}

        {/* Step 2: Passkey */}
        {step === "passkey" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <span className="text-2xl">🔒</span>
                <span>Security Check Required</span>
              </DialogTitle>
              <DialogDescription className="text-left pt-4">
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Enter the admin passkey to authorize this deletion:
                  </p>
                  <Input
                    type="password"
                    placeholder="Enter admin passkey"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handlePasskeySubmit();
                      }
                    }}
                    autoFocus
                    className="w-full"
                  />
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-800 dark:text-red-200">
                        {error}
                      </p>
                    </div>
                  )}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      💡 This passkey protects your data from unauthorized
                      deletion. Only administrators with the passkey can delete
                      all motor readings.
                    </p>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasskeySubmit}
                disabled={!passkey}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify Passkey
              </button>
            </DialogFooter>
          </>
        )}

        {/* Step 3: Final Confirmation */}
        {step === "final" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <span className="text-2xl">🔐</span>
                <span>Passkey Verified</span>
              </DialogTitle>
              <DialogDescription className="text-left pt-4">
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      ✅ Admin passkey verified successfully
                    </p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">
                    This is your final confirmation.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Are you absolutely sure you want to delete{" "}
                    <strong className="text-red-600 dark:text-red-400">
                      {readingsCount} motor readings
                    </strong>{" "}
                    permanently?
                  </p>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-200 font-bold text-center">
                      ⚠️ THIS ACTION CANNOT BE UNDONE ⚠️
                    </p>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Yes, Delete All Data
              </button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

