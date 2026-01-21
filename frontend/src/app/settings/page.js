'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import PermissionGuard, { usePermission } from '../../components/PermissionGuard';

export default function SettingsPage() {
  const { isAuthenticated } = useAuth();
  const canManageSettings = usePermission(['ADMIN']);

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Festify',
    siteDescription: 'Professional Event Management System',
    maxEventCapacity: 1000,
    defaultCurrency: 'INR',
    allowPublicRegistration: true,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    maintenanceMode: false
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    passwordRequireSpecialChars: true,
    passwordRequireNumbers: true,
    sessionTimeout: 30,
    enableTwoFactorAuth: false,
    allowedLoginAttempts: 5,
    accountLockoutDuration: 15
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    paymentGateway: 'razorpay',
    enablePaymentGateway: true,
    processingFee: 2.5,
    minTransactionAmount: 10,
    maxTransactionAmount: 50000,
    autoRefundDays: 7,
    enablePartialRefunds: true
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailFromName: 'Festify Admin',
    emailFromAddress: 'admin@eventman.com',
    smsProvider: 'twilio',
    enableEmailReminders: true,
    enableSMSEventReminders: false,
    enableEmailMarketing: false,
    reminderHoursBefore: 24
  });

  const handleGeneralSettingChange = (key, value) => {
    setGeneralSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSecuritySettingChange = (key, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePaymentSettingChange = (key, value) => {
    setPaymentSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNotificationSettingChange = (key, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async (settingsType, settings) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate saving to localStorage
      localStorage.setItem(`${settingsType}_settings`, JSON.stringify(settings));
      setSuccess(`${settingsType} settings saved successfully!`);
    } catch (err) {
      setError(`Failed to save ${settingsType} settings`);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = () => {
    // Load settings from localStorage (simulated)
    const general = localStorage.getItem('general_settings');
    const security = localStorage.getItem('security_settings');
    const payment = localStorage.getItem('payment_settings');
    const notification = localStorage.getItem('notification_settings');

    if (general) setGeneralSettings(JSON.parse(general));
    if (security) setSecuritySettings(JSON.parse(security));
    if (payment) setPaymentSettings(JSON.parse(payment));
    if (notification) setNotificationSettings(JSON.parse(notification));
  };

  useEffect(() => {
    if (isAuthenticated && canManageSettings) {
      loadSettings();
    }
  }, [isAuthenticated, canManageSettings]);

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'payment', name: 'Payment', icon: '💳' },
    { id: 'notification', name: 'Notifications', icon: '🔔' },
  ];

  if (!canManageSettings) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          You do not have permission to access settings.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Manage system configuration and preferences</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          ✅ {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          ❌ {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'general' && (
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">General Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={generalSettings.siteName}
                  onChange={(e) => handleGeneralSettingChange('siteName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Description
                </label>
                <input
                  type="text"
                  value={generalSettings.siteDescription}
                  onChange={(e) => handleGeneralSettingChange('siteDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Event Capacity
                </label>
                <input
                  type="number"
                  value={generalSettings.maxEventCapacity}
                  onChange={(e) => handleGeneralSettingChange('maxEventCapacity', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Currency
                </label>
                <select
                  value={generalSettings.defaultCurrency}
                  onChange={(e) => handleGeneralSettingChange('defaultCurrency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="publicRegistration"
                  checked={generalSettings.allowPublicRegistration}
                  onChange={(e) => handleGeneralSettingChange('allowPublicRegistration', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="publicRegistration" className="ml-2 block text-sm text-gray-900">
                  Allow public user registration
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={generalSettings.enableEmailNotifications}
                  onChange={(e) => handleGeneralSettingChange('enableEmailNotifications', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                  Enable email notifications
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  checked={generalSettings.enableSMSNotifications}
                  onChange={(e) => handleGeneralSettingChange('enableSMSNotifications', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-900">
                  Enable SMS notifications
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  checked={generalSettings.maintenanceMode}
                  onChange={(e) => handleGeneralSettingChange('maintenanceMode', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
                  Maintenance mode (blocks user access)
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => saveSettings('general', generalSettings)}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save General Settings'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) => handleSecuritySettingChange('passwordMinLength', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => handleSecuritySettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allowed Login Attempts
                </label>
                <input
                  type="number"
                  value={securitySettings.allowedLoginAttempts}
                  onChange={(e) => handleSecuritySettingChange('allowedLoginAttempts', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Lockout Duration (minutes)
                </label>
                <input
                  type="number"
                  value={securitySettings.accountLockoutDuration}
                  onChange={(e) => handleSecuritySettingChange('accountLockoutDuration', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requireSpecialChars"
                  checked={securitySettings.passwordRequireSpecialChars}
                  onChange={(e) => handleSecuritySettingChange('passwordRequireSpecialChars', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="requireSpecialChars" className="ml-2 block text-sm text-gray-900">
                  Require special characters in passwords
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requireNumbers"
                  checked={securitySettings.passwordRequireNumbers}
                  onChange={(e) => handleSecuritySettingChange('passwordRequireNumbers', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="requireNumbers" className="ml-2 block text-sm text-gray-900">
                  Require numbers in passwords
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="twoFactorAuth"
                  checked={securitySettings.enableTwoFactorAuth}
                  onChange={(e) => handleSecuritySettingChange('enableTwoFactorAuth', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="twoFactorAuth" className="ml-2 block text-sm text-gray-900">
                  Enable two-factor authentication
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => saveSettings('security', securitySettings)}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Security Settings'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Gateway
                </label>
                <select
                  value={paymentSettings.paymentGateway}
                  onChange={(e) => handlePaymentSettingChange('paymentGateway', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="razorpay">Razorpay</option>
                  <option value="stripe">Stripe</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Processing Fee (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentSettings.processingFee}
                  onChange={(e) => handlePaymentSettingChange('processingFee', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Transaction Amount
                </label>
                <input
                  type="number"
                  value={paymentSettings.minTransactionAmount}
                  onChange={(e) => handlePaymentSettingChange('minTransactionAmount', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Transaction Amount
                </label>
                <input
                  type="number"
                  value={paymentSettings.maxTransactionAmount}
                  onChange={(e) => handlePaymentSettingChange('maxTransactionAmount', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enablePaymentGateway"
                  checked={paymentSettings.enablePaymentGateway}
                  onChange={(e) => handlePaymentSettingChange('enablePaymentGateway', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enablePaymentGateway" className="ml-2 block text-sm text-gray-900">
                  Enable payment gateway
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enablePartialRefunds"
                  checked={paymentSettings.enablePartialRefunds}
                  onChange={(e) => handlePaymentSettingChange('enablePartialRefunds', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enablePartialRefunds" className="ml-2 block text-sm text-gray-900">
                  Allow partial refunds
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto Refund Days (days after event)
                </label>
                <input
                  type="number"
                  value={paymentSettings.autoRefundDays}
                  onChange={(e) => handlePaymentSettingChange('autoRefundDays', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => saveSettings('payment', paymentSettings)}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Payment Settings'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notification' && (
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email From Name
                </label>
                <input
                  type="text"
                  value={notificationSettings.emailFromName}
                  onChange={(e) => handleNotificationSettingChange('emailFromName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email From Address
                </label>
                <input
                  type="email"
                  value={notificationSettings.emailFromAddress}
                  onChange={(e) => handleNotificationSettingChange('emailFromAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMS Provider
                </label>
                <select
                  value={notificationSettings.smsProvider}
                  onChange={(e) => handleNotificationSettingChange('smsProvider', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="twilio">Twilio</option>
                  <option value="aws-sns">AWS SNS</option>
                  <option value="firebase">Firebase</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reminder Hours Before Event
                </label>
                <input
                  type="number"
                  value={notificationSettings.reminderHoursBefore}
                  onChange={(e) => handleNotificationSettingChange('reminderHoursBefore', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailReminders"
                  checked={notificationSettings.enableEmailReminders}
                  onChange={(e) => handleNotificationSettingChange('enableEmailReminders', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emailReminders" className="ml-2 block text-sm text-gray-900">
                  Enable email reminders
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smsEventReminders"
                  checked={notificationSettings.enableSMSEventReminders}
                  onChange={(e) => handleNotificationSettingChange('enableSMSEventReminders', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="smsEventReminders" className="ml-2 block text-sm text-gray-900">
                  Enable SMS event reminders
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailMarketing"
                  checked={notificationSettings.enableEmailMarketing}
                  onChange={(e) => handleNotificationSettingChange('enableEmailMarketing', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emailMarketing" className="ml-2 block text-sm text-gray-900">
                  Enable email marketing campaigns
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => saveSettings('notification', notificationSettings)}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Notification Settings'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
