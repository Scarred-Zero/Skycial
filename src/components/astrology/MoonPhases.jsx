// import React from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Moon } from 'lucide-react';

// const MoonPhases = () => {
//   const phases = [
//     { phase: "New Moon", activity: "Fresh starts, new routines", icon: "🌑" },
//     { phase: "Waxing Moon", activity: "Building treatments, growth", icon: "🌓" },
//     { phase: "Full Moon", activity: "Intensive care, masks", icon: "🌕" },
//     { phase: "Waning Moon", activity: "Cleansing, detox", icon: "🌗" }
//   ];

//   return (
//     <Card className="glass-card border-white/20">
//       <CardHeader>
//         <CardTitle className="text-white playfair flex items-center">
//           <Moon className="w-6 h-6 mr-2 text-blue-400" /> Moon Phase Beauty Guide
//         </CardTitle>
//         <CardDescription className="text-white/70">Align your beauty routine with lunar cycles</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="text-center mb-8">
//           <img  class="w-48 h-48 mx-auto rounded-full mb-4" alt="Moon phases diagram showing different lunar cycles with beauty symbols" src="https://images.unsplash.com/photo-1595639546396-99140afe3a0d" />
//           <h3 className="text-xl font-semibold text-white mb-2">Current Phase: Waxing Gibbous</h3>
//           <p className="text-white/70">Perfect time for building and enhancing treatments</p>
//         </div>
//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {phases.map((phase, index) => (
//             <div key={index} className="p-4 rounded-lg bg-black/20 border border-white/10 text-center">
//               <div className="text-3xl mb-2">{phase.icon}</div>
//               <h4 className="text-white font-semibold mb-2">{phase.phase}</h4>
//               <p className="text-white/70 text-sm">{phase.activity}</p>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default MoonPhases;