import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onLogin();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.97 0.02 232) 0%, oklch(0.93 0.05 232) 50%, oklch(0.97 0.02 232) 100%)",
      }}
    >
      {/* Subtle background circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "oklch(0.72 0.12 232)" }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-15"
          style={{ background: "oklch(0.65 0.14 232)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative"
      >
        <Card
          className="shadow-2xl border-0"
          style={{ background: "white", borderRadius: "20px" }}
        >
          <CardHeader className="text-center pb-2 pt-8">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex justify-center mb-4"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: "oklch(0.45 0.12 232)" }}
              >
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <h1
              className="text-3xl font-bold tracking-tight"
              style={{ color: "oklch(0.45 0.12 232)" }}
            >
              First Step
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "oklch(0.55 0.06 232)" }}
            >
              Your first step toward smart investing
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8 pt-4">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              data-ocid="login.modal"
            >
              {/* Email */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="login-email"
                  className="text-sm font-medium"
                  style={{ color: "oklch(0.35 0.08 232)" }}
                >
                  Email address
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  data-ocid="login.input"
                  className="h-11 rounded-xl border-2 transition-all focus:ring-0"
                  style={{
                    borderColor: errors.email
                      ? "oklch(0.55 0.22 25)"
                      : "oklch(0.87 0.04 232)",
                  }}
                />
                {errors.email && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: "oklch(0.55 0.22 25)" }}
                    data-ocid="login.error_state"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="login-password"
                    className="text-sm font-medium"
                    style={{ color: "oklch(0.35 0.08 232)" }}
                  >
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={() => toast.info("Password reset coming soon!")}
                    className="text-xs hover:underline transition-colors"
                    style={{ color: "oklch(0.52 0.12 232)" }}
                    data-ocid="login.secondary_button"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  data-ocid="login.input"
                  className="h-11 rounded-xl border-2 transition-all focus:ring-0"
                  style={{
                    borderColor: errors.password
                      ? "oklch(0.55 0.22 25)"
                      : "oklch(0.87 0.04 232)",
                  }}
                />
                {errors.password && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: "oklch(0.55 0.22 25)" }}
                    data-ocid="login.error_state"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold rounded-xl text-white shadow-md hover:shadow-lg transition-all"
                style={{ background: "oklch(0.45 0.12 232)" }}
                data-ocid="login.submit_button"
              >
                Login
              </Button>

              {/* Sign up */}
              <p
                className="text-center text-sm"
                style={{ color: "oklch(0.55 0.05 232)" }}
              >
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => toast.info("Sign up coming soon!")}
                  className="font-semibold hover:underline transition-colors"
                  style={{ color: "oklch(0.45 0.12 232)" }}
                  data-ocid="login.primary_button"
                >
                  Sign up
                </button>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Footer attribution */}
        <p
          className="text-center text-xs mt-5"
          style={{ color: "oklch(0.60 0.06 232)" }}
        >
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
