import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Dilemma {
  optionA: string;
  optionB: string;
}

const dilemmas: Dilemma[] = [
  {"optionA": "Βρεφικό άρωμα", "optionB": "Χωρίς άρωμα"},
  {"optionA": "Babywearing", "optionB": "Καρότσι"},
  {"optionA": "Πρωινό μπανάκι", "optionB": "Βραδινό μπανάκι"},
  {"optionA": "Μπιμπερό", "optionB": "Ποτηράκι"},
  {"optionA": "Μαγειρεμένα φρούτα", "optionB": "Ωμά φρούτα"},
  {"optionA": "Παιχνίδια Montessori", "optionB": "Αισθητηριακά παιχνίδια"},
  {"optionA": "Ύπνος μόνο του", "optionB": "Συγκοίμηση"},
  {"optionA": "Μωρουδιακό κουβερτάκι", "optionB": "Sleeping bag"},
  {"optionA": "Κούνια", "optionB": "Παρκοκρέβατο"},
  {"optionA": "Βόλτα στο πάρκο", "optionB": "Βόλτα στη θάλασσα"},
  {"optionA": "Pancakes", "optionB": "Βάφλες"},
  {"optionA": "Smoothie bowl", "optionB": "Τοστ"},
  {"optionA": "Χειροποίητο φαγητό", "optionB": "Delivery"},
  {"optionA": "Ζεστός καφές", "optionB": "Iced coffee"},
  {"optionA": "Meal prep", "optionB": "Στο λεπτό"},
  {"optionA": "Λίστα με μολύβι", "optionB": "Εφαρμογή"},
  {"optionA": "Πρωινό με ησυχία", "optionB": "Πρωινό με φασαρία"},
  {"optionA": "Μεσημεριανός ύπνος", "optionB": "Βραδινή χαλάρωση"},
  {"optionA": "Ζάχαρη", "optionB": "Μέλι"},
  {"optionA": "Ομελέτα", "optionB": "Κουάκερ"},
  {"optionA": "Αρωματικό χώρου", "optionB": "Κεράκι"},
  {"optionA": "Ροζ παστέλ", "optionB": "Nude beige"},
  {"optionA": "Cozy κουβέρτα", "optionB": "Fluffy ρόμπα"},
  {"optionA": "Netflix", "optionB": "YouTube"},
  {"optionA": "Τακτοποίηση πρωί", "optionB": "Τακτοποίηση βράδυ"},
  {"optionA": "Planner χαρτί", "optionB": "Ψηφιακό ημερολόγιο"},
  {"optionA": "Μίνιμαλ", "optionB": "Πολύχρωμο"},
  {"optionA": "Ανοιχτά φώτα", "optionB": "Χαμηλό φωτισμό"},
  {"optionA": "Πλυντήριο πρωί", "optionB": "Πλυντήριο βράδυ"},
  {"optionA": "Παιδικό δωμάτιο μίνιμαλ", "optionB": "Πολύχρωμο"},
  {"optionA": "Bubble bath", "optionB": "Γρήγορο ντουζ"},
  {"optionA": "Scrunchie", "optionB": "Κλάμερ"},
  {"optionA": "Gloss", "optionB": "Balm"},
  {"optionA": "Yoga", "optionB": "Περπάτημα"},
  {"optionA": "Journal", "optionB": "Affirmations"},
  {"optionA": "Σπιτική μάσκα", "optionB": "Sheet mask"},
  {"optionA": "Fleecy pyjamas", "optionB": "Cotton set"},
  {"optionA": "Ρόφημα βοτάνων", "optionB": "Καφές"},
  {"optionA": "Weekend ξεκούρασης", "optionB": "Έξοδος"},
  {"optionA": "Podcast", "optionB": "Μουσική"},
  {"optionA": "Μαμάδες του πάρκου", "optionB": "Μαμάδες της παιδικής χαράς"},
  {"optionA": "Playdate στο σπίτι", "optionB": "Playdate στο πάρκο"},
  {"optionA": "Ομαδικό chat", "optionB": "1:1 μήνυμα"},
  {"optionA": "Κουβέντα με καφέ", "optionB": "Βόλτα με καρότσι"},
  {"optionA": "Κλήση", "optionB": "Γραπτό μήνυμα"},
  {"optionA": "Girls night in", "optionB": "Girls night out"},
  {"optionA": "Χειροποίητο δώρο", "optionB": "Αγοραστό"},
  {"optionA": "Μικρή παρέα", "optionB": "Μεγάλη παρέα"},
  {"optionA": "Μοιρασμός εμπειριών", "optionB": "Χιούμορ"},
  {"optionA": "Διακοπές με φίλους", "optionB": "Οικογενειακές διακοπές"},
  {"optionA": "Πρωινή μαμά", "optionB": "Βραδινή μαμά"},
  {"optionA": "Minimal phone use", "optionB": "Doomscrolling"},
  {"optionA": "Advent calendar", "optionB": "Surprise box"},
  {"optionA": "Ρομαντική ταινία", "optionB": "Κωμωδία"},
  {"optionA": "Αλμυρό σνακ", "optionB": "Γλυκό"},
  {"optionA": "Shopping online", "optionB": "Κατάστημα"},
  {"optionA": "Pinterest", "optionB": "Instagram"},
  {"optionA": "Pastel nails", "optionB": "Nude nails"},
  {"optionA": "Απλή τούρτα", "optionB": "Υπερπαραγωγή"},
  {"optionA": "Planner stickers", "optionB": "Pastel highlighters"}
];

export default function ThisOrThat() {
  const [currentIndex, setCurrentIndex] = useState(() => 
    Math.floor(Math.random() * dilemmas.length)
  );
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        navigateNext();
      } else {
        navigatePrev();
      }
    }
  };

  const navigateNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection('left');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % dilemmas.length);
      setSelectedOption(null);
      setSlideDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const navigatePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection('right');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + dilemmas.length) % dilemmas.length);
      setSelectedOption(null);
      setSlideDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const currentDilemma = dilemmas[currentIndex];

  return (
    <Card className="bg-purple-50/80 border-none hover:shadow-xl transition-all overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Pacifico', cursive" }}>
            This or That? 🤔
          </h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={navigatePrev}
              disabled={isAnimating}
              className="h-9 w-9 p-0 rounded-full hover:bg-purple-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={navigateNext}
              disabled={isAnimating}
              className="h-9 w-9 p-0 rounded-full hover:bg-purple-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div 
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`transition-all duration-300 ease-out ${
              slideDirection === 'left' 
                ? '-translate-x-full opacity-0' 
                : slideDirection === 'right' 
                ? 'translate-x-full opacity-0' 
                : 'translate-x-0 opacity-100'
            }`}
          >
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setSelectedOption(selectedOption === 'A' ? null : 'A')}
                variant={selectedOption === 'A' ? 'default' : 'outline'}
                className={`h-28 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                  selectedOption === 'A' ? 'scale-105 shadow-lg' : 'hover:scale-105'
                }`}
              >
                <span className="text-3xl">💖</span>
                <span className="text-sm font-semibold text-center px-2">{currentDilemma.optionA}</span>
              </Button>

              <Button
                onClick={() => setSelectedOption(selectedOption === 'B' ? null : 'B')}
                variant={selectedOption === 'B' ? 'default' : 'outline'}
                className={`h-28 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                  selectedOption === 'B' ? 'scale-105 shadow-lg' : 'hover:scale-105'
                }`}
              >
                <span className="text-3xl">✨</span>
                <span className="text-sm font-semibold text-center px-2">{currentDilemma.optionB}</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            {currentIndex + 1} / {dilemmas.length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Swipe ή χρησιμοποίησε τα βελάκια
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
