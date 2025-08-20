import React from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Star } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { getUser, purchasePremiumReport } from '@/lib/supabaseData';

    const PremiumReports = () => {
      const { toast } = useToast();
      const user = getUser();

      const handlePurchase = (reportName, cost) => {
        if (!user) {
          toast({ variant: "destructive", title: "Please log in to purchase." });
          return;
        }
        if (purchasePremiumReport(user.email, cost)) {
          toast({
            title: "Purchase Successful! ✨",
            description: `You've unlocked the ${reportName}.`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Purchase Failed",
            description: "You don't have enough points for this report.",
          });
        }
      };

      return (
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white playfair flex items-center">
              <Star className="w-6 h-6 mr-2 text-yellow-400" /> Premium Astrology Reports
            </CardTitle>
            <CardDescription className="text-white/70">Detailed cosmic analysis powered by AstroAPI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                <h3 className="text-white font-semibold text-xl mb-3">Complete Beauty Chart</h3>
                <p className="text-white/80 mb-4">Comprehensive analysis of your birth chart with specific focus on beauty, style, and personal enhancement.</p>
                <ul className="text-white/70 text-sm space-y-2 mb-6 list-disc list-inside">
                  <li>Detailed planetary influences on appearance</li>
                  <li>Best colors and styles for your chart</li>
                  <li>Optimal timing for beauty treatments</li>
                  <li>Personalized skincare recommendations</li>
                </ul>
                <Button onClick={() => handlePurchase('Complete Beauty Chart', 500)} className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black">
                  Purchase - 500 Points
                </Button>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                <h3 className="text-white font-semibold text-xl mb-3">Monthly Beauty Forecast</h3>
                <p className="text-white/80 mb-4">Monthly predictions and guidance for your beauty journey, including best days for treatments and style changes.</p>
                <ul className="text-white/70 text-sm space-y-2 mb-6 list-disc list-inside">
                  <li>Daily beauty guidance for the month</li>
                  <li>Lucky colors and styles for you</li>
                  <li>Best dates for hair cuts & treatments</li>
                  <li>Cosmic beauty challenges to try</li>
                </ul>
                <Button onClick={() => handlePurchase('Monthly Beauty Forecast', 800)} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  Purchase - 800 Points
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    };

    export default PremiumReports;