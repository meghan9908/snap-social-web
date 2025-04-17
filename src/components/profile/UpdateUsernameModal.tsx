
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/ClerkUserContext";

interface UpdateUsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpdateUsernameModal = ({ isOpen, onClose }: UpdateUsernameModalProps) => {
  const [newUsername, setNewUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateUsername, isUsernameAvailable } = useAuth();
  const { toast } = useToast();

  if (!isOpen) return null;

  const checkUsernameAvailability = async () => {
    if (!newUsername.trim() || newUsername.length < 3) {
      setIsAvailable(false);
      return;
    }

    setIsChecking(true);
    const available = await isUsernameAvailable(newUsername);
    setIsAvailable(available);
    setIsChecking(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUsername || !isAvailable) return;
    
    setIsSubmitting(true);
    const result = await updateUsername(newUsername);
    setIsSubmitting(false);
    
    if (result.success) {
      toast({
        title: "Username Updated",
        description: result.message
      });
      onClose();
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update Username</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              New Username
            </label>
            <div className="relative">
              <Input
                id="username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                onBlur={checkUsernameAvailability}
                placeholder="Enter a unique username"
                className={`pr-10 ${
                  isAvailable === true
                    ? "border-green-500"
                    : isAvailable === false
                    ? "border-red-500"
                    : ""
                }`}
                minLength={3}
                required
              />
              {isChecking && (
                <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-3" />
              )}
            </div>
            {isAvailable === false && newUsername.length >= 3 && (
              <p className="text-red-500 text-sm mt-1">Username is already taken</p>
            )}
            {isAvailable === true && (
              <p className="text-green-500 text-sm mt-1">Username is available</p>
            )}
            {newUsername.length > 0 && newUsername.length < 3 && (
              <p className="text-amber-500 text-sm mt-1">Username must be at least 3 characters</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isAvailable || isSubmitting || newUsername.length < 3}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Update Username
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUsernameModal;
