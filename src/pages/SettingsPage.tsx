import { useState } from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import type { AppSettings } from '@/types';
import { ChangePasswordModal } from '@/components/auth/ChangePasswordModal';// import the schema for changing password


const settingsTabs = [
  { id: 'general', label: 'General' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'security', label: 'Security' },
  { id: 'preferences', label: 'Preferences' },
];

export function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const [activeTab, setActiveTab] = useState('general');
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false); // State to control the visibility of the Change Password modal

  const handleChange = (key: keyof AppSettings, value: string | number | boolean) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
  };

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={[{ label: 'Settings' }]} />
        <h1 className="text-2xl font-bold mt-2">Settings</h1>
        <p className="text-muted text-sm mt-1">Manage your account and application preferences</p>
      </div>

      <Card className="mt-12">
        <Tabs tabs={settingsTabs} activeTab={activeTab} onChange={setActiveTab}>
          {activeTab === 'general' && (
            <div className="space-y-5 max-w-lg">
              <div>
                <label className="block text-sm font-medium mb-1.5">Language</label>
                <select
                  value={localSettings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Timezone</label>
                <select
                  value={localSettings.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Date Format</label>
                <select
                  value={localSettings.dateFormat}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <option value="MMM d, yyyy">Jan 1, 2026</option>
                  <option value="dd/MM/yyyy">01/01/2026</option>
                  <option value="yyyy-MM-dd">2026-01-01</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4 max-w-lg">
              {[
                { key: 'emailNotifications' as const, label: 'Email Notifications', desc: 'Receive notifications via email' },
                { key: 'pushNotifications' as const, label: 'Push Notifications', desc: 'Browser push notifications' },
                { key: 'taskReminders' as const, label: 'Task Reminders', desc: 'Reminders for upcoming deadlines' },
                { key: 'weeklyDigest' as const, label: 'Weekly Digest', desc: 'Weekly summary of activity' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleChange(item.key, !localSettings[item.key])}
                    className={`relative h-6 w-11 rounded-full transition-colors ${localSettings[item.key] ? 'bg-primary' : 'bg-slate-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0 h-5 w-5 rounded-full bg-white shadow transition-transform ${localSettings[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4 max-w-lg">
              {[
                { key: 'compactMode' as const, label: 'Compact Mode', desc: 'Reduce spacing for denser layouts' },
                { key: 'showAvatars' as const, label: 'Show Avatars', desc: 'Display user avatars throughout the app' },
                { key: 'animationsEnabled' as const, label: 'Animations', desc: 'Enable UI animations and transitions' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleChange(item.key, !localSettings[item.key])}
                    className={`relative h-6 w-11 rounded-full transition-colors ${localSettings[item.key] ? 'bg-primary' : 'bg-slate-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0 h-5 w-5 rounded-full bg-white shadow transition-transform ${localSettings[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5 max-w-lg">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-muted">Add an extra layer of security</p>
                </div>
                <button
                  onClick={() => handleChange('twoFactorEnabled', !localSettings.twoFactorEnabled)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${localSettings.twoFactorEnabled ? 'bg-primary' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-0.5 left-0 h-5 w-5 rounded-full bg-white shadow transition-transform ${localSettings.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={localSettings.sessionTimeout}
                  onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                  min={5}
                  max={120}
                />
              </div>
              <Button variant="outline" 
                onClick={() => setPasswordModalOpen(true)} //opens change password modal when clicked
                >Change Password</Button>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-5 max-w-lg">
              <div>
                <label className="block text-sm font-medium mb-1.5">Default View</label>
                <select
                  value={localSettings.defaultView}
                  onChange={(e) => handleChange('defaultView', e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="projects">Projects</option>
                  <option value="tasks">Tasks</option>
                  <option value="kanban">Kanban</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Items Per Page</label>
                <select
                  value={localSettings.itemsPerPage}
                  onChange={(e) => handleChange('itemsPerPage', parseInt(e.target.value))}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border">
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </Tabs>
      </Card>
      <ChangePasswordModal //creating component
      open={passwordModalOpen}
      onClose={() => setPasswordModalOpen(false)}
      />
    </div>
  );
}
