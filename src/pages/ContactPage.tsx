import { Mail, MessageSquare, HelpCircle } from 'lucide-react';
import PageHero from '../components/shared/PageHero';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Get in Touch"
        description="Have questions? We're here to help. Reach out and we'll respond within 24 hours."
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-gray-100 text-center">
              <div className="inline-flex p-4 bg-blue-100 rounded-2xl mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">For general inquiries and support</p>
              <a href="mailto:hello@foundrly.com" className="text-blue-600 font-medium hover:underline">
                hello@foundrly.com
              </a>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border border-gray-100 text-center">
              <div className="inline-flex p-4 bg-green-100 rounded-2xl mb-4">
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sales</h3>
              <p className="text-gray-600 mb-4">Interested in Enterprise?</p>
              <a href="mailto:sales@foundrly.com" className="text-green-600 font-medium hover:underline">
                sales@foundrly.com
              </a>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border border-gray-100 text-center">
              <div className="inline-flex p-4 bg-purple-100 rounded-2xl mb-4">
                <HelpCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Support</h3>
              <p className="text-gray-600 mb-4">Need help with your account?</p>
              <a href="mailto:support@foundrly.com" className="text-purple-600 font-medium hover:underline">
                support@foundrly.com
              </a>
            </div>
          </div>

          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                  placeholder="Your Company"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:shadow-xl hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
