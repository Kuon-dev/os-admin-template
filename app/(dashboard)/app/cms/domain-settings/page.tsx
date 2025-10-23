"use client";

import { useTranslations } from "next-intl";
import { useDomainSettingsStore } from "@/stores/domain-settings-store";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe,
  Search,
  Link,
  BarChart3,
  Save,
  RotateCcw,
  Copy,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Spring animation config for smooth, Mac-OS like motion
const spring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

// Fade in animation for cards
const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      ...spring,
    },
  }),
};

export default function DomainSettingsPage() {
  const t = useTranslations("domainSettings");
  const {
    settings,
    isSaving,
    updateDomainConfig,
    updateSeoDefaults,
    updateUrlStructure,
    updateAnalytics,
    saveSettings,
  } = useDomainSettingsStore();

  const [mounted, setMounted] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Local state for form fields
  const [primaryDomain, setPrimaryDomain] = useState(settings.domain.primaryDomain);
  const [customDomains, setCustomDomains] = useState(settings.domain.customDomains.join(", "));
  const [titlePattern, setTitlePattern] = useState(settings.seo.titlePattern);
  const [metaDescription, setMetaDescription] = useState(settings.seo.metaDescription);
  const [ogImage, setOgImage] = useState(settings.seo.ogImage);
  const [favicon, setFavicon] = useState(settings.seo.favicon);
  const [slugPattern, setSlugPattern] = useState(settings.url.slugPattern);
  const [trailingSlash, setTrailingSlash] = useState(settings.url.trailingSlash);
  const [redirects, setRedirects] = useState(
    settings.url.redirects.map((r) => `${r.from} -> ${r.to}`).join("\n")
  );
  const [gaId, setGaId] = useState(settings.analytics.gaId);
  const [gtmId, setGtmId] = useState(settings.analytics.gtmId);
  const [customScripts, setCustomScripts] = useState(settings.analytics.customScripts);

  // Validation states
  const [domainValid, setDomainValid] = useState(true);
  const [urlValid, setUrlValid] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setHasChanges(true);

    // Validate domain
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z]{2,})+$/;
    setDomainValid(!primaryDomain || domainRegex.test(primaryDomain));

    // Validate URL pattern
    setUrlValid(slugPattern.includes("{slug}") || slugPattern === "/{slug}");
  }, [
    primaryDomain,
    customDomains,
    titlePattern,
    metaDescription,
    ogImage,
    favicon,
    slugPattern,
    trailingSlash,
    redirects,
    gaId,
    gtmId,
    customScripts,
  ]);

  if (!mounted) {
    return null;
  }

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = async () => {
    if (!domainValid || !urlValid) {
      toast.error("Please fix validation errors before saving");
      return;
    }

    updateDomainConfig({
      primaryDomain,
      customDomains: customDomains.split(",").map((d) => d.trim()).filter(Boolean),
    });

    updateSeoDefaults({
      titlePattern,
      metaDescription,
      ogImage,
      favicon,
    });

    updateUrlStructure({
      slugPattern,
      trailingSlash,
      redirects: redirects
        .split("\n")
        .map((line) => {
          const [from, to] = line.split("->").map((s) => s.trim());
          return from && to ? { from, to } : null;
        })
        .filter((r): r is { from: string; to: string } => r !== null),
    });

    updateAnalytics({
      gaId,
      gtmId,
      customScripts,
    });

    await saveSettings();

    toast.success(t("saved"), {
      description: "Your domain settings have been updated successfully",
    });

    setHasChanges(false);
  };

  const handleReset = () => {
    setPrimaryDomain(settings.domain.primaryDomain);
    setCustomDomains(settings.domain.customDomains.join(", "));
    setTitlePattern(settings.seo.titlePattern);
    setMetaDescription(settings.seo.metaDescription);
    setOgImage(settings.seo.ogImage);
    setFavicon(settings.seo.favicon);
    setSlugPattern(settings.url.slugPattern);
    setTrailingSlash(settings.url.trailingSlash);
    setRedirects(settings.url.redirects.map((r) => `${r.from} -> ${r.to}`).join("\n"));
    setGaId(settings.analytics.gaId);
    setGtmId(settings.analytics.gtmId);
    setCustomScripts(settings.analytics.customScripts);
    setHasChanges(false);
    toast.info("Changes discarded");
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Compact Page Header - Mac-OS style with 24px bottom margin */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="mb-6"
      >
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
      </motion.div>

      {/* Bento Grid - Asymmetric layout for visual hierarchy */}
      <div className="grid auto-rows-[minmax(200px,auto)] gap-4 md:grid-cols-6">
        {/* Domain Configuration Card - Large featured card */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="col-span-full md:col-span-4"
        >
          <Card className="h-full overflow-hidden !p-0">
            <div className="border-b bg-muted/20 px-5 py-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">{t("domain.title")}</h2>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t("domain.description")}
              </p>
            </div>
            <div className="space-y-4 p-5">
              {/* Primary Domain - Compact layout */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="primary-domain" className="text-xs font-medium">
                    {t("domain.primaryDomain")}
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p className="text-xs">{t("domain.primaryDomainDescription")}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="relative">
                  <Input
                    id="primary-domain"
                    type="text"
                    placeholder={t("domain.primaryDomainPlaceholder")}
                    value={primaryDomain}
                    onChange={(e) => setPrimaryDomain(e.target.value)}
                    className={`pr-16 text-sm ${!domainValid ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                  <div className="absolute right-1 top-1 flex items-center gap-1">
                    <AnimatePresence mode="wait">
                      {!domainValid && primaryDomain && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={spring}
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex h-7 w-7 items-center justify-center rounded">
                                <X className="h-3.5 w-3.5 text-destructive" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Invalid domain format</p>
                            </TooltipContent>
                          </Tooltip>
                        </motion.div>
                      )}
                      {domainValid && primaryDomain && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={spring}
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded">
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleCopy(primaryDomain, "domain")}
                    >
                      <AnimatePresence mode="wait">
                        {copiedField === "domain" ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={spring}
                          >
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={spring}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Custom Domains */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="custom-domains" className="text-xs font-medium">
                    {t("domain.customDomains")}
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p className="text-xs">{t("domain.customDomainsDescription")}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="custom-domains"
                  type="text"
                  placeholder={t("domain.customDomainsPlaceholder")}
                  value={customDomains}
                  onChange={(e) => setCustomDomains(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* URL Quick Settings - Compact card */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="col-span-full md:col-span-2"
        >
          <Card className="h-full overflow-hidden !p-0">
            <div className="border-b bg-muted/20 px-4 py-3">
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">URL Config</h2>
              </div>
            </div>
            <div className="flex h-[calc(100%-57px)] flex-col justify-between p-4">
              {/* Slug Pattern Preview */}
              <div className="space-y-2">
                <Label htmlFor="slug-pattern-mini" className="text-xs font-medium">
                  {t("url.slugPattern")}
                </Label>
                <Input
                  id="slug-pattern-mini"
                  type="text"
                  value={slugPattern}
                  onChange={(e) => setSlugPattern(e.target.value)}
                  className="font-mono text-xs"
                />
                {urlValid && slugPattern && (
                  <div className="rounded-md bg-muted/50 px-2 py-1">
                    <p className="text-[10px] text-muted-foreground">
                      {slugPattern.replace("{slug}", "my-page")}
                    </p>
                  </div>
                )}
              </div>

              {/* Trailing Slash Toggle */}
              <div className="mt-4 flex items-center justify-between rounded-md border border-border/40 bg-muted/20 px-3 py-2">
                <Label htmlFor="trailing-slash-mini" className="text-xs">
                  Trailing /
                </Label>
                <Switch
                  id="trailing-slash-mini"
                  checked={trailingSlash}
                  onCheckedChange={setTrailingSlash}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* SEO Defaults Card */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="col-span-full md:col-span-3"
        >
          <Card className="h-full overflow-hidden !p-0">
            <div className="border-b bg-muted/20 px-5 py-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">{t("seo.title")}</h2>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t("seo.description")}
              </p>
            </div>
            <div className="space-y-4 p-5">
              {/* Title Pattern */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="title-pattern" className="text-xs font-medium">
                    {t("seo.titlePattern")}
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p className="text-xs">{t("seo.titlePatternDescription")}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="title-pattern"
                  type="text"
                  placeholder={t("seo.titlePatternPlaceholder")}
                  value={titlePattern}
                  onChange={(e) => setTitlePattern(e.target.value)}
                  className="text-sm font-mono"
                />
              </div>

              {/* Meta Description - Full width */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta-description" className="text-xs font-medium">
                    {t("seo.metaDescription")}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {metaDescription.length}/160
                  </span>
                </div>
                <Textarea
                  id="meta-description"
                  placeholder={t("seo.metaDescriptionPlaceholder")}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="min-h-16 resize-none text-sm"
                  rows={2}
                  maxLength={160}
                />
              </div>

              {/* OG Image & Favicon */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="og-image" className="text-xs font-medium">
                    {t("seo.ogImage")}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="og-image"
                      type="url"
                      placeholder={t("seo.ogImagePlaceholder")}
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      className="text-sm"
                    />
                    {ogImage && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => window.open(ogImage, "_blank")}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="favicon" className="text-xs font-medium">
                    {t("seo.favicon")}
                  </Label>
                  <Input
                    id="favicon"
                    type="text"
                    placeholder={t("seo.faviconPlaceholder")}
                    value={favicon}
                    onChange={(e) => setFavicon(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Analytics IDs - Compact card */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="col-span-full md:col-span-3"
        >
          <Card className="h-full overflow-hidden !p-0">
            <div className="border-b bg-muted/20 px-5 py-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Analytics IDs</h2>
              </div>
            </div>
            <div className="grid gap-4 p-5">
              {/* GA ID */}
              <div className="space-y-1.5">
                <Label htmlFor="ga-id" className="text-xs font-medium">
                  {t("analytics.gaId")}
                </Label>
                <Input
                  id="ga-id"
                  type="text"
                  placeholder={t("analytics.gaIdPlaceholder")}
                  value={gaId}
                  onChange={(e) => setGaId(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>

              {/* GTM ID */}
              <div className="space-y-1.5">
                <Label htmlFor="gtm-id" className="text-xs font-medium">
                  {t("analytics.gtmId")}
                </Label>
                <Input
                  id="gtm-id"
                  type="text"
                  placeholder={t("analytics.gtmIdPlaceholder")}
                  value={gtmId}
                  onChange={(e) => setGtmId(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* URL Redirects - Wide card */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="col-span-full md:col-span-4"
        >
          <Card className="h-full overflow-hidden !p-0">
            <div className="border-b bg-muted/20 px-5 py-3">
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">{t("url.redirects")}</h2>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t("url.redirectsDescription")}
              </p>
            </div>
            <div className="p-5">
              <Textarea
                id="redirects"
                placeholder={t("url.redirectsPlaceholder")}
                value={redirects}
                onChange={(e) => setRedirects(e.target.value)}
                className="min-h-32 resize-none font-mono text-xs"
                rows={6}
              />
            </div>
          </Card>
        </motion.div>

        {/* Analytics Scripts - Tall card */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="col-span-full md:col-span-2 md:row-span-2"
        >
          <Card className="h-full overflow-hidden !p-0">
            <div className="border-b bg-muted/20 px-4 py-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Custom Scripts</h2>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t("analytics.customScriptsDescription")}
              </p>
            </div>
            <div className="p-4">
              <Textarea
                id="custom-scripts"
                placeholder={t("analytics.customScriptsPlaceholder")}
                value={customScripts}
                onChange={(e) => setCustomScripts(e.target.value)}
                className="h-[calc(100%-16px)] min-h-48 resize-none font-mono text-xs"
              />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Floating Action Bar - Appears only when changes detected */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={spring}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
          >
            <Card className="!flex-row !gap-3 !p-0 !border-border/40 !bg-background/95 px-4 py-3 !shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
                <span className="font-medium">Unsaved changes</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  disabled={isSaving}
                  className="h-8"
                >
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  Discard
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !domainValid || !urlValid}
                  size="sm"
                  className="h-8"
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        className="mr-1.5 h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-1.5 h-3.5 w-3.5" />
                      {t("saveButton")}
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom padding to prevent content being hidden by floating bar */}
      <div className="h-24" />
    </div>
  );
}
