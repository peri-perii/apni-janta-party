import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, MapPin, Clock, Ticket, User, QrCode, AlertCircle, Sparkles } from "lucide-react";
import { AJPEvent } from "../types";

export const Events: React.FC = () => {
  const [events, setEvents] = useState<AJPEvent[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState<AJPEvent | null>(null);
  const [ticketName, setTicketName] = useState("");
  const [showTicketPass, setShowTicketPass] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState<{
    id: string;
    eventName: string;
    date: string;
    location: string;
    holder: string;
    seatNum: string;
    barcode: string;
  } | null>(null);

  const defaultEvents: AJPEvent[] = [
    {
      id: "ev-1",
      title: "BALTI-HACK 2026",
      category: "Hackathon",
      date: "July 12, 2026",
      time: "09:00 AM - 09:00 PM IST",
      location: "Sector 4 Community Sandbox",
      description: "A 12-hour sprint to ship open-source web and hardware interfaces designed to extinguish municipal bureaucracy.",
      capacity: 150,
      registeredCount: 132
    },
    {
      id: "ev-2",
      title: "KOLA-WEB RE-UX MEETING",
      category: "Creator Meetup",
      date: "July 18, 2026",
      time: "05:30 PM - 08:30 PM IST",
      location: "Chitta Ta Cafe, Park Corridor",
      description: "Gather with localized developers, illustrators, and civic organizers to redraw archaic neighborhood feedback boards.",
      capacity: 80,
      registeredCount: 52
    },
    {
      id: "ev-3",
      title: "DELULU SYSTEM SHIFT CABAL",
      category: "Startup Night",
      date: "July 25, 2026",
      time: "06:00 PM - 10:00 PM IST",
      location: "The Garage Hub, Outer Ring Road",
      description: "Pitches from founders building bootstrap solutions. Slides are forbidden. Only real software compiles allowed.",
      capacity: 120,
      registeredCount: 115
    },
    {
      id: "ev-4",
      title: "WARD 12 SOLID DRILLS",
      category: "Community Drive",
      date: "August 02, 2026",
      time: "07:00 AM - 11:30 AM IST",
      location: "Central Ward Public Park Ground",
      description: "Armed with wrenches, buckets, and seeds, we fix public leaks and distribute physical canvas tool packets directly.",
      capacity: 250,
      registeredCount: 198
    },
    {
      id: "ev-5",
      title: "BURNOUT BOUNDARIES DEBATE",
      category: "Debate",
      date: "August 10, 2026",
      time: "04:00 PM - 06:30 PM IST",
      location: "Ward Mental Health Pavilion",
      description: "A lively conversation addressing how we dismantle hyper-achievement burnout and construct humane local structures.",
      capacity: 60,
      registeredCount: 45
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem("ajp_events_list");
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (_) {
        setEvents(defaultEvents);
      }
    } else {
      setEvents(defaultEvents);
      localStorage.setItem("ajp_events_list", JSON.stringify(defaultEvents));
    }

    // Try pre-filling ticket holder name from Janta pin board
    const savedPins = localStorage.getItem("ajp_janta_pins");
    if (savedPins) {
      try {
        const parsed = JSON.parse(savedPins);
        if (parsed.length > 0) {
          setTicketName(parsed[0].name);
        }
      } catch (_) {}
    }
  }, []);

  const handleRegisterClick = (ev: AJPEvent) => {
    setSelectedEvent(ev);
    setShowTicketPass(false);
  };

  const handleGenerateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !ticketName.trim()) return;

    // Increment registered count
    const updatedEvents = events.map((ev) => {
      if (ev.id === selectedEvent.id) {
        return { ...ev, registeredCount: Math.min(ev.capacity, ev.registeredCount + 1) };
      }
      return ev;
    });
    setEvents(updatedEvents);
    localStorage.setItem("ajp_events_list", JSON.stringify(updatedEvents));

    // Generate ticket receipt
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randRow = letters[Math.floor(Math.random() * letters.length)];
    const randNum = Math.floor(Math.random() * 50) + 1;
    const barcodeStr = `AJP-${selectedEvent.id.toUpperCase()}-${Math.floor(Math.random() * 8888) + 1111}`;

    setGeneratedTicket({
      id: `TKT-${Math.floor(Math.random() * 89999) + 10000}`,
      eventName: selectedEvent.title,
      date: selectedEvent.date,
      location: selectedEvent.location,
      holder: ticketName.toUpperCase().trim(),
      seatNum: `${randRow}-${randNum}`,
      barcode: barcodeStr,
    });

    setShowTicketPass(true);

    // Audio Ticket synthesis sound effects
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (_) {}
  };

  const filters = ["All", "Hackathon", "Creator Meetup", "Startup Night", "Community Drive", "Workshop", "Debate"];

  const filteredEvents = activeFilter === "All"
    ? events
    : events.filter((e) => e.category === activeFilter);

  return (
    <section id="events" className="py-24 px-4 bg-ajp-black text-white border-b-6 border-black relative overflow-hidden">
      
      {/* Background radial checkers */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#ffffff 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px"
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Editorial Heading Box */}
        <div className="border-4 border-white p-6 md:p-8 mb-16 bg-white text-black shadow-[8px_8px_0px_#FFD600] max-w-4xl bg-ajp-white">
          <span className="font-mono text-xs font-black bg-black text-white px-3 py-1 rounded-none uppercase inline-block mb-3">
            SECTION 07 // COMMUNITY MEETS
          </span>
          <h2 className="font-display font-black text-4xl sm:text-6xl uppercase leading-none">
            AJP FIELD CALENDAR.
          </h2>
          <p className="font-sans font-semibold text-gray-700 text-lg mt-4 max-w-2xl">
            We don’t do zoom webinars or boardroom meetings. We debate, run code sprints, and fix pipes physically. Reserve your pass for our next localized field action.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-10 pb-4 border-b-4 border-white/20">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`p-2 px-4 font-mono text-[11px] font-black uppercase rounded-none cursor-pointer transition-all border-2 ${
                activeFilter === f
                  ? "bg-ajp-yellow text-black border-white shadow-[3px_3px_0px_rgba(255,255,255,1)] translate-x-[-1px] translate-y-[-1px]"
                  : "bg-transparent text-white border-white/40 hover:bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredEvents.map((ev) => {
            const seatsLeft = ev.capacity - ev.registeredCount;
            return (
              <div
                key={ev.id}
                className="bg-zinc-900 border-4 border-white p-6 md:p-8 flex flex-col justify-between min-h-[300px] hover:border-ajp-yellow transition-colors relative rounded-none shadow-[6px_6px_0px_#111111]"
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[9px] font-black bg-ajp-blue text-white px-1.5 py-0.5 border border-black uppercase rounded-none">
                      {ev.category}
                    </span>
                    <span className="font-mono text-xs text-yellow-400 font-bold uppercase">
                      {seatsLeft > 0 ? `⚡ LAST ${seatsLeft} SEATS` : "🚫 FULL HOUSE"}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-2xl tracking-tight text-white mb-3">
                    {ev.title}
                  </h3>

                  <p className="font-sans text-xs leading-relaxed text-gray-300 mb-6 font-semibold">
                    {ev.description}
                  </p>
                </div>

                {/* Details list */}
                <div className="space-y-2 mb-6 border-t-2 border-dashed border-white/10 pt-4">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400">
                    <Calendar className="w-3.5 h-3.5 text-ajp-yellow" />
                    <span>{ev.date}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400">
                    <Clock className="w-3.5 h-3.5 text-ajp-orange" />
                    <span>{ev.time}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400">
                    <MapPin className="w-3.5 h-3.5 text-ajp-blue" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>

                {/* Secure Seat trigger */}
                <button
                  onClick={() => handleRegisterClick(ev)}
                  disabled={seatsLeft <= 0}
                  className={`w-full font-display font-black text-xs uppercase p-3.5 brutal-border border-2 text-center rounded-none transition-transform cursor-pointer ${
                    seatsLeft <= 0
                      ? "bg-gray-600 text-gray-400 border-black cursor-not-allowed"
                      : "bg-ajp-yellow text-black border-white shadow-[3px_3px_0px_#FF5A36] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  }`}
                >
                  {seatsLeft <= 0 ? "SEATS EXHAUSTED" : "GET SEAT PASS PASS"}
                </button>

              </div>
            );
          })}
        </div>

        {/* Dynamic Ticket Overlay Dialog */}
        <AnimatePresence>
          {selectedEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
              
              {!showTicketPass ? (
                /* Ticket Request Input form drawer */
                <motion.div
                  initial={{ scale: 0.9, y: 30 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9 }}
                  className="bg-white text-black border-4 border-black p-6 md:p-8 max-w-md w-full rounded-none shadow-xl bg-ajp-white"
                >
                  <h3 className="font-display font-black text-xl uppercase mb-1 flex items-center gap-2">
                    <Ticket className="w-6 h-6 fill-ajp-yellow stroke-black" />
                    <span>SECURE PASS FOR</span>
                  </h3>
                  <h4 className="font-mono text-sm font-black text-red-500 uppercase mb-6 truncate">
                    {selectedEvent.title}
                  </h4>

                  <form onSubmit={handleGenerateTicketSubmit} className="space-y-4">
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1.5">
                        Pass Holder Name
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={24}
                        placeholder="e.g. KARAN DEV"
                        value={ticketName}
                        onChange={(e) => setTicketName(e.target.value)}
                        className="w-full border-2 border-black p-3 font-mono text-xs bg-white text-black rounded-none"
                      />
                    </div>

                    <div className="bg-yellow-50 border border-yellow-300 p-2.5 flex items-start gap-2 max-w-sm rounded-none">
                      <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                      <p className="font-mono text-[9.5px] text-yellow-800 uppercase leading-snug">
                        By logging your seat, you commit to bringing one solution bucket / idea to the field. No gatekeeping required.
                      </p>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(null)}
                        className="w-1/3 bg-gray-100 text-black font-mono text-xs uppercase p-3 border-2 border-black"
                      >
                        ABANDON
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 bg-ajp-blue text-white font-display font-black text-xs uppercase p-3 brutal-border border-2 shadow-[2px_2px_0px_#111111]"
                      >
                        COMPILE PASSPORT ✓
                      </button>
                    </div>

                  </form>
                </motion.div>
              ) : (
                /* The Generated Monumental Ticket Pass */
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="bg-white text-black border-4 border-black max-w-lg w-full rounded-none overflow-hidden hover:rotate-[0.5deg] transition-transform shadow-2xl relative bg-ajp-white"
                >
                  <div className="absolute top-2 right-2 font-mono text-[8px] font-black border border-black bg-yellow-100 p-0.5 rotate-[-3deg] uppercase">
                    official entry pass
                  </div>

                  {/* Punch Ticket side hole cutouts */}
                  <div className="absolute top-1/2 -left-3.5 w-6 h-6 rounded-full bg-black border border-white z-20 hidden md:block" />
                  <div className="absolute top-1/2 -right-3.5 w-6 h-6 rounded-full bg-black border border-white z-20 hidden md:block" />

                  {/* Ticket Header Graphic */}
                  <div className="bg-ajp-yellow p-4 border-b-4 border-black text-center relative select-none">
                    <span className="font-mono font-bold text-[9px] uppercase tracking-widest text-black">
                      APNI JANTA PARTY // CALENDAR OF SOLUTIONS
                    </span>
                    <h3 className="font-display font-black text-2xl uppercase mt-1 leading-none tracking-tight">
                      {generatedTicket?.eventName}
                    </h3>
                  </div>

                  {/* Ticket Details Panel */}
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 border-b-2 border-dashed border-gray-200 pb-4">
                      <div>
                        <span className="block font-mono text-[8px] font-black text-gray-400 uppercase">
                          HOLDER NAME:
                        </span>
                        <span className="font-display font-extrabold text-sm uppercase text-black">
                          {generatedTicket?.holder}
                        </span>
                      </div>
                      <div>
                        <span className="block font-mono text-[8px] font-black text-gray-400 uppercase">
                          SEAT ASSIGNMENT:
                        </span>
                        <span className="font-mono font-black text-sm text-ajp-blue uppercase">
                          ROW {generatedTicket?.seatNum}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-b-2 border-dashed border-gray-200 pb-4">
                      <div>
                        <span className="block font-mono text-[8px] font-black text-gray-400 uppercase">
                          LAUNCH DATE:
                        </span>
                        <span className="font-mono text-xs font-bold text-black uppercase">
                          {generatedTicket?.date}
                        </span>
                      </div>
                      <div>
                        <span className="block font-mono text-[8px] font-black text-gray-400 uppercase">
                          VENUE CORRIDOR:
                        </span>
                        <span className="font-mono text-xs font-bold text-black uppercase truncate block">
                          {generatedTicket?.location}
                        </span>
                      </div>
                    </div>

                    {/* Barcode and Scannable indicators representation */}
                    <div className="pt-2 flex flex-col items-center justify-center bg-gray-50 border-2 border-black p-3 space-y-2 rounded-none">
                      <div className="flex items-center gap-1">
                        <QrCode className="w-5 h-5 text-gray-800" />
                        <span className="font-mono text-[10px] font-black uppercase text-gray-700">
                          {generatedTicket?.barcode}
                        </span>
                      </div>

                      {/* Pure CSS retro raw barcode graphic */}
                      <div className="w-full h-8 flex justify-between select-none">
                        {Array.from({ length: 48 }).map((_, i) => (
                          <div
                            key={i}
                            className="bg-black h-full"
                            style={{
                              width: i % 3 === 0 ? "3px" : i % 5 === 0 ? "1px" : "2px"
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA close buttons */}
                  <div className="bg-gray-100 p-4 border-t-2 border-black flex gap-3">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="w-1/2 bg-white text-black font-mono text-xs uppercase p-3 border-2 border-black shadow-[2px_2px_0px_#111111]"
                    >
                      🖨️ PRINT PASS
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEvent(null);
                        setGeneratedTicket(null);
                        setShowTicketPass(false);
                      }}
                      className="w-1/2 bg-ajp-orange text-white font-display font-black text-xs uppercase p-3 brutal-border border-2"
                    >
                      DOUSED DONE!
                    </button>
                  </div>

                </motion.div>
              )}

            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
