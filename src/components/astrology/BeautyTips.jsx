// import React from 'react';
// import { motion } from 'framer-motion';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { useToast } from '@/components/ui/use-toast';

// const BeautyTips = () => {
//   const { toast } = useToast();

//   const getPersonalizedTips = (sign) => {
//     let tip = "";
//     switch(sign) {
//       case "Fire Signs":
//         tip = "A bold, red lipstick will perfectly complement your fiery spirit today!";
//         break;
//       case "Earth Signs":
//         tip = "Try a mineral-based foundation to enhance your natural, grounded beauty.";
//         break;
//       case "Air Signs":
//         tip = "A touch of highlighter on your cheekbones will capture your light, airy essence.";
//         break;
//       case "Water Signs":
//         tip = "A dewy setting spray will give you that dreamy, oceanic glow.";
//         break;
//       default:
//         tip = "Embrace your unique cosmic energy today!";
//     }
//     toast({
//       title: `Personalized Tip for ${sign} ✨`,
//       description: tip,
//     });
//   };

//   const beautyTipsData = [
//     { sign: "Fire Signs", tip: "Bold colors and dramatic looks suit your fiery energy. Make a statement!", colors: ["#FF6B6B", "#FF8E53", "#FF6B9D"] },
//     { sign: "Earth Signs", tip: "Natural, earthy tones complement your grounded nature. Focus on healthy, glowing skin.", colors: ["#8B7355", "#A0937D", "#B5A082"] },
//     { sign: "Air Signs", tip: "Light, airy looks with subtle highlights match your intellectual and social nature.", colors: ["#87CEEB", "#B0E0E6", "#E0F6FF"] },
//     { sign: "Water Signs", tip: "Flowing, oceanic colors and dewy finishes reflect your emotional depth.", colors: ["#4682B4", "#5F9EA0", "#708090"] }
//   ];

//   return (
//     <div className="grid md:grid-cols-2 gap-6">
//       {beautyTipsData.map((tip, index) => (
//         <motion.div
//           key={index}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: index * 0.1 }}
//         >
//           <Card className="glass-card border-white/20 h-full">
//             <CardHeader>
//               <CardTitle className="text-white playfair">{tip.sign}</CardTitle>
//               <div className="flex space-x-2">
//                 {tip.colors.map((color, colorIndex) => (
//                   <div key={colorIndex} className="w-6 h-6 rounded-full border-2 border-white/30" style={{ backgroundColor: color }} />
//                 ))}
//               </div>
//             </CardHeader>
//             <CardContent>
//               <p className="text-white/80">{tip.tip}</p>
//               <Button onClick={() => getPersonalizedTips(tip.sign)} className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
//                 Get Personalized Tips
//               </Button>
//             </CardContent>
//           </Card>
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// export default BeautyTips;