import Link from "next/link"

import { Separator } from "@/components/ui/separator"

export default function TermsPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-[800px] space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-rose-800">Terms of Service & Privacy Policy</h1>
          <p className="text-gray-500">Last updated: April 1, 2023</p>
        </div>

        <div className="prose max-w-none">
          <h2>Terms of Service</h2>
          <p>
            Welcome to DeutschDiva. By accessing or using our website and services, you agree to be bound by these Terms
            of Service.
          </p>

          <h3>1. Account Registration</h3>
          <p>
            To access certain features of the platform, you must register for an account. You agree to provide accurate,
            current, and complete information during the registration process and to update such information to keep it
            accurate, current, and complete.
          </p>

          <h3>2. Course Enrollment</h3>
          <p>
            Upon enrolling in our A1 German course, you will be granted access to course materials for the duration
            specified at the time of enrollment. We reserve the right to modify course content to improve the learning
            experience.
          </p>

          <h3>3. User Conduct</h3>
          <p>You agree not to:</p>
          <ul>
            <li>
              Use the platform for any illegal purpose or in violation of any local, state, national, or international
              law
            </li>
            <li>Share your account credentials with others or allow others to access your account</li>
            <li>Copy, distribute, or disclose any part of the platform in any medium</li>
            <li>
              Attempt to interfere with, compromise the system integrity or security, or decipher any transmissions to
              or from the servers running the platform
            </li>
          </ul>

          <h3>4. Intellectual Property</h3>
          <p>
            All content, features, and functionality of the DeutschDiva platform, including but not limited to text,
            graphics, logos, icons, images, audio clips, digital downloads, and software, are the exclusive property of
            DeutschDiva and are protected by copyright, trademark, and other intellectual property laws.
          </p>

          <h3>5. Termination</h3>
          <p>
            We reserve the right to terminate or suspend your account and access to the platform at our sole discretion,
            without notice, for conduct that we believe violates these Terms of Service or is harmful to other users,
            us, or third parties, or for any other reason.
          </p>

          <Separator className="my-8" />

          <h2>Privacy Policy</h2>
          <p>
            This Privacy Policy describes how DeutschDiva collects, uses, and discloses information about users of our
            website and services.
          </p>

          <h3>1. Information We Collect</h3>
          <p>We collect information you provide directly to us when you:</p>
          <ul>
            <li>Register for an account</li>
            <li>Enroll in a course</li>
            <li>Complete profile information</li>
            <li>Participate in course activities</li>
            <li>Contact customer support</li>
          </ul>
          <p>
            This information may include your name, email address, gender, and other information you choose to provide.
          </p>

          <h3>2. How We Use Your Information</h3>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Personalize your experience and deliver content relevant to your interests</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
          </ul>

          <h3>3. Data Security</h3>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized
            access, disclosure, alteration, and destruction.
          </p>

          <h3>4. Cookies</h3>
          <p>
            We may use cookies and similar technologies to collect information about your browsing activities and to
            personalize your experience on our platform.
          </p>

          <h3>5. Your Rights</h3>
          <p>
            You may update, correct, or delete your account information at any time by accessing your account settings.
            You may also contact us to request access to, correction of, or deletion of personal information that you
            have provided to us.
          </p>

          <h3>6. Changes to Privacy Policy</h3>
          <p>
            We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the
            date at the top of the policy and, in some cases, we may provide you with additional notice.
          </p>

          <Separator className="my-8" />

          <h2>Contact Us</h2>
          <p>If you have any questions about these Terms of Service or Privacy Policy, please contact us at:</p>
          <p>
            <strong>Email:</strong>{" "}
            <Link href="mailto:legal@DeutschDivagerman.com" className="text-rose-700 hover:underline">
              legal@DeutschDivagerman.com
            </Link>
          </p>
          <p>
            <strong>Address:</strong> 123 Language Street, Berlin, Germany 10115
          </p>
        </div>
      </div>
    </div>
  )
}

