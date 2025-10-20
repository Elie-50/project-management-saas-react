import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import React, { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { signup } from "@/redux/auth/authSlice"
import ErrorMessage from "./ErrorMessage"
import { useNavigate } from "react-router"

type SignUpFormData = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignUpFormData>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...credentials } = formData;

    const res = await dispatch(signup(credentials));

    if (res.meta.requestStatus == 'fulfilled') {
      navigate('/login');
    }
  }

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="e.g: JohnDoe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                    <Input
                      id="first-name"
                      name="firstName"
                      placeholder="e.g: John"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      required 
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="last-name">
                      Last Name
                    </FieldLabel>
                    <Input
                      id="last-name"
                      name="lastName"
                      placeholder="e.g: Doe"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 6 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button disabled={loading} type="submit">Create Account</Button>
                <ErrorMessage error={error} />
                <FieldDescription className="text-center">
                  Already have an account? <a href="/login">Login</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
