import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Bell, Send, Check, AlertCircle, Volume2, Mail, Heart, MessageSquare, Calendar, Star, Users } from "lucide-react";
import { usePushNotifications, useMatchNotifications } from "@/hooks/use-push-notifications";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface NotificationSettingsData {
  email: boolean;
  matches: boolean;
  messages: boolean;
  daily_digest: boolean;
  new_features: boolean;
  community_updates: boolean;
  push_enabled: boolean;
}

export default function NotificationSettings() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettingsData>({
    email: true,
    matches: true,
    messages: true,
    daily_digest: false,
    new_features: true,
    community_updates: true,
    push_enabled: false,
  });

  const { 
    supported, 
    permission, 
    requestPermission, 
    showNotification 
  } = usePushNotifications();
  const { playNotificationSound } = useMatchNotifications();
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("notification_settings")
        .eq("id", user.id)
        .single();

      if (profile?.notification_settings) {
        const saved = profile.notification_settings as any;
        setSettings({
          email: saved.email ?? true,
          matches: saved.matches ?? true,
          messages: saved.messages ?? true,
          daily_digest: saved.daily_digest ?? false,
          new_features: saved.new_features ?? true,
          community_updates: saved.community_updates ?? true,
          push_enabled: saved.push_enabled ?? false,
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (key: keyof NotificationSettingsData, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({ notification_settings: newSettings })
        .eq("id", user.id);

      if (error) throw error;
      
      toast.success(language === "el" ? "Αποθηκεύτηκε!" : "Saved!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(language === "el" ? "Σφάλμα αποθήκευσης" : "Error saving");
      // Revert on error
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  const handleEnablePush = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast.success(language === "el" ? "Οι ειδοποιήσεις ενεργοποιήθηκαν!" : "Notifications enabled!");
      handleSettingChange('push_enabled', true);
    } else {
      toast.error(language === "el" ? "Οι ειδοποιήσεις δεν επιτράπηκαν" : "Notifications not allowed");
    }
  };

  const handleTestNotification = async () => {
    if (permission !== "granted") {
      toast.error(language === "el" ? "Πρώτα ενεργοποίησε τις ειδοποιήσεις" : "Enable notifications first");
      return;
    }

    setTesting(true);
    playNotificationSound();
    
    setTimeout(() => {
      showNotification("🎉 Test Notification!", {
        body: language === "el" 
          ? "Οι ειδοποιήσεις λειτουργούν σωστά!" 
          : "Notifications are working!",
        tag: "test-notification",
        url: "/notification-settings",
      });
      
      toast.success(language === "el" ? "Test notification στάλθηκε!" : "Test notification sent!");
      setTesting(false);
    }, 300);
  };

  const handleTestSound = () => {
    playNotificationSound();
    toast.success(language === "el" ? "Ήχος ειδοποίησης!" : "Notification sound!");
  };

  const getPushStatusIcon = () => {
    if (!supported) return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    if (permission === "granted") return <Check className="w-4 h-4 text-green-500" />;
    if (permission === "denied") return <AlertCircle className="w-4 h-4 text-destructive" />;
    return <Bell className="w-4 h-4 text-primary" />;
  };

  const getPushStatusText = () => {
    if (!supported) return language === "el" ? "Δεν υποστηρίζεται" : "Not supported";
    if (permission === "granted") return language === "el" ? "Ενεργές" : "Enabled";
    if (permission === "denied") return language === "el" ? "Αποκλεισμένες" : "Blocked";
    return language === "el" ? "Απενεργοποιημένες" : "Disabled";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F8E9EE, #F5E8F0)' }}>
        <div className="animate-spin-flower text-6xl">🌸</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(135deg, #F8E9EE, #F5E8F0)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-primary/20 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            {language === "el" ? "Ρυθμίσεις Ειδοποιήσεων" : "Notification Settings"}
          </h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Push Notifications Card */}
        <Card className="p-5 bg-gradient-to-br from-white/90 to-[#FDF7F9] border-2 border-[#F3DCE5] rounded-[24px] shadow-md animate-fade-in">
          <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Push Notifications
          </h3>
          
          <div className="p-4 bg-gradient-to-r from-primary/5 to-pink-50 rounded-2xl border border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getPushStatusIcon()}
                <span className="text-sm font-medium">
                  {language === "el" ? "Κατάσταση" : "Status"}
                </span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                permission === "granted" 
                  ? "bg-green-100 text-green-700" 
                  : permission === "denied"
                    ? "bg-red-100 text-red-700"
                    : "bg-muted text-muted-foreground"
              }`}>
                {getPushStatusText()}
              </span>
            </div>

            {supported && permission !== "granted" && permission !== "denied" && (
              <Button
                onClick={handleEnablePush}
                className="w-full rounded-full bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 text-white"
                size="sm"
              >
                <Bell className="w-4 h-4 mr-2" />
                {language === "el" ? "Ενεργοποίηση Push" : "Enable Push"}
              </Button>
            )}

            {permission === "denied" && (
              <p className="text-xs text-muted-foreground mt-2">
                {language === "el" 
                  ? "Οι ειδοποιήσεις είναι αποκλεισμένες. Ενεργοποίησέ τες από τις ρυθμίσεις του browser." 
                  : "Notifications are blocked. Enable them in browser settings."}
              </p>
            )}

            {permission === "granted" && (
              <div className="flex gap-2">
                <Button
                  onClick={handleTestNotification}
                  disabled={testing}
                  variant="outline"
                  className="flex-1 rounded-full border-primary/30 hover:bg-primary/5"
                  size="sm"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {testing ? "..." : (language === "el" ? "Δοκιμή" : "Test")}
                </Button>
                <Button
                  onClick={handleTestSound}
                  variant="outline"
                  className="rounded-full border-primary/30 hover:bg-primary/5"
                  size="sm"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* In-App Notifications */}
        <Card className="p-5 bg-gradient-to-br from-white/90 to-[#FDF7F9] border-2 border-[#F3DCE5] rounded-[24px] shadow-md animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            {language === "el" ? "Ειδοποιήσεις Εφαρμογής" : "App Notifications"}
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
              <Label htmlFor="matches" className="text-sm font-medium flex items-center gap-3 cursor-pointer">
                <span className="w-8 h-8 flex items-center justify-center bg-pink-100 rounded-full">💕</span>
                <div>
                  <span className="block">{language === "el" ? "Νέα matches" : "New matches"}</span>
                  <span className="text-xs text-muted-foreground">
                    {language === "el" ? "Όταν ταιριάζεις με κάποια μαμά" : "When you match with a mom"}
                  </span>
                </div>
              </Label>
              <Switch
                id="matches"
                checked={settings.matches}
                onCheckedChange={(checked) => handleSettingChange('matches', checked)}
                disabled={saving}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
              <Label htmlFor="messages" className="text-sm font-medium flex items-center gap-3 cursor-pointer">
                <span className="w-8 h-8 flex items-center justify-center bg-pink-100 rounded-full">💬</span>
                <div>
                  <span className="block">{language === "el" ? "Μηνύματα" : "Messages"}</span>
                  <span className="text-xs text-muted-foreground">
                    {language === "el" ? "Νέα μηνύματα από μαμάδες" : "New messages from moms"}
                  </span>
                </div>
              </Label>
              <Switch
                id="messages"
                checked={settings.messages}
                onCheckedChange={(checked) => handleSettingChange('messages', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
              <Label htmlFor="community" className="text-sm font-medium flex items-center gap-3 cursor-pointer">
                <span className="w-8 h-8 flex items-center justify-center bg-pink-100 rounded-full">👥</span>
                <div>
                  <span className="block">{language === "el" ? "Κοινότητα" : "Community"}</span>
                  <span className="text-xs text-muted-foreground">
                    {language === "el" ? "Απαντήσεις στις ερωτήσεις σου" : "Answers to your questions"}
                  </span>
                </div>
              </Label>
              <Switch
                id="community"
                checked={settings.community_updates}
                onCheckedChange={(checked) => handleSettingChange('community_updates', checked)}
                disabled={saving}
              />
            </div>
          </div>
        </Card>

        {/* Email Notifications */}
        <Card className="p-5 bg-gradient-to-br from-white/90 to-[#FDF7F9] border-2 border-[#F3DCE5] rounded-[24px] shadow-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            {language === "el" ? "Email Ειδοποιήσεις" : "Email Notifications"}
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-3 cursor-pointer">
                <span className="w-8 h-8 flex items-center justify-center bg-pink-100 rounded-full">📧</span>
                <div>
                  <span className="block">{language === "el" ? "Email ειδοποιήσεις" : "Email notifications"}</span>
                  <span className="text-xs text-muted-foreground">
                    {language === "el" ? "Γενικές ενημερώσεις" : "General updates"}
                  </span>
                </div>
              </Label>
              <Switch
                id="email"
                checked={settings.email}
                onCheckedChange={(checked) => handleSettingChange('email', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
              <Label htmlFor="daily" className="text-sm font-medium flex items-center gap-3 cursor-pointer">
                <span className="w-8 h-8 flex items-center justify-center bg-pink-100 rounded-full">☀️</span>
                <div>
                  <span className="block">{language === "el" ? "Ημερήσια σύνοψη" : "Daily digest"}</span>
                  <span className="text-xs text-muted-foreground">
                    {language === "el" ? "Μία φορά την ημέρα" : "Once a day"}
                  </span>
                </div>
              </Label>
              <Switch
                id="daily"
                checked={settings.daily_digest}
                onCheckedChange={(checked) => handleSettingChange('daily_digest', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
              <Label htmlFor="features" className="text-sm font-medium flex items-center gap-3 cursor-pointer">
                <span className="w-8 h-8 flex items-center justify-center bg-pink-100 rounded-full">✨</span>
                <div>
                  <span className="block">{language === "el" ? "Νέες λειτουργίες" : "New features"}</span>
                  <span className="text-xs text-muted-foreground">
                    {language === "el" ? "Ενημερώσεις για την εφαρμογή" : "App updates"}
                  </span>
                </div>
              </Label>
              <Switch
                id="features"
                checked={settings.new_features}
                onCheckedChange={(checked) => handleSettingChange('new_features', checked)}
                disabled={saving}
              />
            </div>
          </div>
        </Card>

        {/* Info text */}
        <p className="text-xs text-center text-muted-foreground px-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {language === "el" 
            ? "Μπορείς να αλλάξεις τις ρυθμίσεις ειδοποιήσεων οποιαδήποτε στιγμή 🤍" 
            : "You can change notification settings anytime 🤍"}
        </p>
      </div>
    </div>
  );
}
