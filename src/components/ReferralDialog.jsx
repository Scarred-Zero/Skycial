import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const ReferralDialog = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const referralCode = "COSMICBEAUTY150";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied! ✨",
      description: "Referral code copied to your clipboard.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/20">
        <DialogHeader>
          <DialogTitle className="gold-gradient-text playfair text-2xl">Refer a Friend!</DialogTitle>
          <DialogDescription className="text-white/70">
            Earn 150 points for every friend who joins using your code!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Label htmlFor="referral-code" className="text-white/90">Your Referral Code</Label>
          <div className="flex items-center space-x-2">
            <Input id="referral-code" value={referralCode} readOnly className="bg-black/20 border-white/20 text-white" />
            <Button size="icon" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralDialog;