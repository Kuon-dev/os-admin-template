"use client";

import { useTranslations } from "next-intl";
import { useSettingsStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Sun,
  Moon,
  Monitor,
  Globe,
  Palette,
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import {
  SettingsSection,
  SettingsGroup,
  SettingsItem,
} from "@/components/ui/settings-section";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const {
    theme,
    locale,
    emailNotifications,
    pushNotifications,
    smsNotifications,
    setTheme,
    setLocale,
    toggleEmailNotifications,
    togglePushNotifications,
    toggleSmsNotifications,
  } = useSettingsStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Theme options for segmented control
  const themeOptions = [
    { value: "light", label: t("appearance.theme.light"), icon: Sun },
    { value: "dark", label: t("appearance.theme.dark"), icon: Moon },
    { value: "system", label: t("appearance.theme.system"), icon: Monitor },
  ];

  // Handlers with toast feedback
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as "light" | "dark" | "system");
    toast.success("Theme updated", {
      description: `Switched to ${newTheme} theme`,
    });
  };

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale as "en" | "cn");
    toast.success("Language updated", {
      description: `Switched to ${newLocale === "en" ? "English" : "中文"}`,
    });
  };

  const handleNotificationToggle = (
    type: "email" | "push" | "sms",
    enabled: boolean
  ) => {
    const labels = {
      email: "Email notifications",
      push: "Push notifications",
      sms: "SMS notifications",
    };

    toast.success(`${labels[type]} ${enabled ? "enabled" : "disabled"}`);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </motion.div>

      {/* Settings Sections */}
      <div className="flex flex-col gap-8">
        {/* Appearance Settings */}
        <SettingsSection
          title={t("appearance.title")}
          description={t("appearance.description")}
          icon={Palette}
          delay={0.1}
        >
          <SettingsGroup>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("appearance.theme.title")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("appearance.theme.description")}
                </p>
              </div>
              <SegmentedControl
                options={themeOptions}
                value={theme}
                onChange={handleThemeChange}
                className="w-full"
              />
            </div>
          </SettingsGroup>
        </SettingsSection>

        {/* Language Settings */}
        <SettingsSection
          title={t("language.title")}
          description={t("language.description")}
          icon={Globe}
          delay={0.15}
        >
          <SettingsGroup>
            <RadioGroup
              value={locale}
              onValueChange={handleLocaleChange}
              className="space-y-3"
            >
              <motion.div
                className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent/50"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <RadioGroupItem value="en" id="locale-en" />
                <Label
                  htmlFor="locale-en"
                  className="flex flex-1 cursor-pointer items-center gap-3"
                >
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">{t("language.english")}</div>
                    <div className="text-sm text-muted-foreground">English</div>
                  </div>
                </Label>
              </motion.div>
              <motion.div
                className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent/50"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <RadioGroupItem value="cn" id="locale-cn" />
                <Label
                  htmlFor="locale-cn"
                  className="flex flex-1 cursor-pointer items-center gap-3"
                >
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">{t("language.chinese")}</div>
                    <div className="text-sm text-muted-foreground">中文</div>
                  </div>
                </Label>
              </motion.div>
            </RadioGroup>
          </SettingsGroup>
        </SettingsSection>

        {/* Notifications Settings */}
        <SettingsSection
          title={t("notifications.title")}
          description={t("notifications.description")}
          icon={Bell}
          delay={0.2}
        >
          <SettingsGroup>
            <div className="divide-y">
              {/* Email Notifications */}
              <SettingsItem
                label={t("notifications.email")}
                description="Receive important updates and alerts via email"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={(checked) => {
                          toggleEmailNotifications();
                          handleNotificationToggle("email", checked);
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span>Toggle email notifications</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </SettingsItem>

              {/* Push Notifications */}
              <SettingsItem
                label={t("notifications.push")}
                description="Receive push notifications in your browser"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Switch
                        id="push-notifications"
                        checked={pushNotifications}
                        onCheckedChange={(checked) => {
                          togglePushNotifications();
                          handleNotificationToggle("push", checked);
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-3 w-3" />
                      <span>Toggle push notifications</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </SettingsItem>

              {/* SMS Notifications */}
              <SettingsItem
                label={t("notifications.sms")}
                description="Receive critical alerts via SMS text message"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Switch
                        id="sms-notifications"
                        checked={smsNotifications}
                        onCheckedChange={(checked) => {
                          toggleSmsNotifications();
                          handleNotificationToggle("sms", checked);
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-3 w-3" />
                      <span>Toggle SMS notifications</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </SettingsItem>
            </div>
          </SettingsGroup>
        </SettingsSection>
      </div>
    </div>
  );
}

