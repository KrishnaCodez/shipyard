"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Left side - Image and branding */}
      <div className="relative hidden bg-zinc-900 md:block">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/70 to-zinc-900/90">
          <div className="flex h-full flex-col justify-between p-8 text-white">
            <div>
              <Image height={50} width={200} alt="logo" src="/logo.svg" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">
                "Discover, Launch, and Thrive - The New Era of Innovation!"
              </h2>
              <div className="space-y-1">
                <p className="font-medium">Urvish Mali</p>
                <p className="text-sm text-zinc-300">Founder</p>
              </div>
            </div>
          </div>
        </div>
        <img
          src="https://unifyhighschool.org/wp-content/uploads/2020/10/fi-1080x628.jpg"
          width={1080}
          height={1080}
          alt="Background"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right side - Sign up form */}
      <div className="flex flex-col justify-center p-4 md:p-8 lg:p-12">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Create your account
            </h1>
            <p className="text-muted-foreground">
              Enter your information to get started
            </p>
          </div>

          <SignUp.Root>
            <SignUp.Step name="start" className="space-y-4">
              <Clerk.GlobalError className="block text-sm text-destructive text-center" />

              <div className="grid grid-cols-2 gap-4">
                <Clerk.Field name="firstName" className="space-y-2">
                  <Clerk.Label asChild>
                    <Label>First name</Label>
                  </Clerk.Label>
                  <Clerk.Input type="text" placeholder="Steve" required asChild>
                    <Input />
                  </Clerk.Input>
                  <Clerk.FieldError className="block text-sm text-destructive" />
                </Clerk.Field>

                <Clerk.Field name="lastName" className="space-y-2">
                  <Clerk.Label asChild>
                    <Label>Last name</Label>
                  </Clerk.Label>
                  <Clerk.Input type="text" placeholder="Jobs" required asChild>
                    <Input />
                  </Clerk.Input>
                  <Clerk.FieldError className="block text-sm text-destructive" />
                </Clerk.Field>
              </div>

              <Clerk.Field name="emailAddress" className="space-y-2">
                <Clerk.Label asChild>
                  <Label>Email</Label>
                </Clerk.Label>
                <Clerk.Input
                  type="email"
                  placeholder="steve@apple.com"
                  required
                  asChild
                >
                  <Input />
                </Clerk.Input>
                <Clerk.FieldError className="block text-sm text-destructive" />
              </Clerk.Field>

              <Clerk.Field name="password" className="space-y-2">
                <Clerk.Label asChild>
                  <Label>Password</Label>
                </Clerk.Label>
                <Clerk.Input
                  type="password"
                  placeholder="Create a secure password"
                  required
                  asChild
                >
                  <Input />
                </Clerk.Input>
                <Clerk.FieldError className="block text-sm text-destructive" />
              </Clerk.Field>

              <div className="grid w-full gap-y-4 pt-2">
                <SignUp.Action submit asChild>
                  <Button className="w-full">
                    <Clerk.Loading>
                      {(isLoading) => {
                        return isLoading ? (
                          <Loader className="size-4 animate-spin" />
                        ) : (
                          "Create account"
                        );
                      }}
                    </Clerk.Loading>
                  </Button>
                </SignUp.Action>

                <div className="grid gap-3">
                  <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                    or
                  </p>
                  <Clerk.Connection name="google" asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      className="w-full"
                    >
                      <Clerk.Loading scope="provider:google">
                        {(isLoading) =>
                          isLoading ? (
                            <Loader className="size-4 animate-spin" />
                          ) : (
                            <>
                              <GoogleIcon className="mr-2 h-4 w-4" />
                              Sign up with Google
                            </>
                          )
                        }
                      </Clerk.Loading>
                    </Button>
                  </Clerk.Connection>
                </div>

                <div className="text-center">
                  <Button variant="link" size="sm" asChild>
                    <Clerk.Link navigate="sign-in">
                      Already have an account? Sign in
                    </Clerk.Link>
                  </Button>
                </div>
              </div>
            </SignUp.Step>

            <SignUp.Step name="verifications" className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-xl font-semibold">Verify your email</h2>
                <p className="text-sm text-muted-foreground">
                  We've sent a verification code to your email
                </p>
              </div>

              <Clerk.GlobalError className="block text-sm text-destructive text-center" />

              <SignUp.Strategy name="email_code">
                <Clerk.Field name="code" className="space-y-4">
                  <Clerk.Label className="sr-only">Email code</Clerk.Label>
                  <div className="grid gap-y-2 items-center justify-center">
                    <div className="flex justify-center text-center">
                      <Clerk.Input
                        type="otp"
                        autoSubmit
                        className="flex justify-center has-[:disabled]:opacity-50"
                        render={({ value, status }) => {
                          return (
                            <div
                              data-status={status}
                              className="relative flex h-12 w-12 items-center justify-center border-y border-r border-input text-lg shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md data-[status=selected]:ring-1 data-[status=selected]:ring-ring data-[status=cursor]:ring-1 data-[status=cursor]:ring-ring"
                            >
                              {value}
                            </div>
                          );
                        }}
                      />
                    </div>
                    <Clerk.FieldError className="block text-sm text-destructive text-center" />
                    <SignUp.Action
                      asChild
                      resend
                      className="text-muted-foreground"
                      fallback={({ resendableAfter }) => (
                        <Button
                          variant="link"
                          size="sm"
                          disabled
                          className="mx-auto"
                        >
                          Resend code (
                          <span className="tabular-nums">
                            {resendableAfter}
                          </span>
                          )
                        </Button>
                      )}
                    >
                      <Button variant="link" size="sm" className="mx-auto">
                        Didn&apos;t receive a code? Resend
                      </Button>
                    </SignUp.Action>
                  </div>
                </Clerk.Field>

                <SignUp.Action submit asChild>
                  <Button className="w-full">
                    <Clerk.Loading>
                      {(isLoading) => {
                        return isLoading ? (
                          <Loader className="size-4 animate-spin" />
                        ) : (
                          "Verify"
                        );
                      }}
                    </Clerk.Loading>
                  </Button>
                </SignUp.Action>
              </SignUp.Strategy>

              <div className="text-center">
                <Button variant="link" size="sm" asChild>
                  <Clerk.Link navigate="sign-in">
                    Already have an account? Sign in
                  </Clerk.Link>
                </Button>
              </div>
            </SignUp.Step>

            <SignUp.Step name="continue" className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-xl font-semibold">Complete your profile</h2>
                <p className="text-sm text-muted-foreground">
                  Just one more step to finish setting up your account
                </p>
              </div>

              <Clerk.GlobalError className="block text-sm text-destructive text-center" />

              <Clerk.Field name="username" className="space-y-2">
                <Clerk.Label asChild>
                  <Label>Username</Label>
                </Clerk.Label>
                <Clerk.Input type="text" placeholder="johndoe" required asChild>
                  <Input />
                </Clerk.Input>
                <Clerk.FieldError className="block text-sm text-destructive" />
              </Clerk.Field>

              <SignUp.Action submit asChild>
                <Button className="w-full">
                  <Clerk.Loading>
                    {(isLoading) => {
                      return isLoading ? (
                        <Loader className="size-4 animate-spin" />
                      ) : (
                        "Complete sign up"
                      );
                    }}
                  </Clerk.Loading>
                </Button>
              </SignUp.Action>

              <div className="text-center">
                <Button variant="link" size="sm" asChild>
                  <Clerk.Link navigate="sign-in">
                    Already have an account? Sign in
                  </Clerk.Link>
                </Button>
              </div>
            </SignUp.Step>
          </SignUp.Root>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      {...props}
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
      <path fill="none" d="M1 1h22v22H1z" />
    </svg>
  );
}
