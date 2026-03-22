'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
  const t = useTranslations('nav');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('buyer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">ف</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">إنشاء حساب جديد</h1>
            <p className="text-gray-500 mt-2">انضم إلى منصة سوق الفلاح</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع الحساب
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'buyer', label: 'مشتري' },
                  { value: 'seller', label: 'بائع' },
                  { value: 'investor', label: 'مستثمر' }
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setUserType(type.value)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      userType === type.value
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="الاسم الكامل"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
                placeholder="+212 6XX XXX XXX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="********"
                required
              />
            </div>

            <div className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-primary" required />
              <span className="mr-2 text-sm text-gray-600">
                أوافق على{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  الشروط والأحكام
                </Link>
              </span>
            </div>

            <button type="submit" className="btn-primary w-full">
              إنشاء حساب
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                سجل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
