"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from '../../components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { useToast } from "@/components/ui/use-toast";
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/utils/firebase"
import { useSelector } from "react-redux"
import { selectUser } from "@/store/slice"

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string()
    .email(),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  // Fetch user data from the Redux slice
  const user = useSelector(selectUser);

  // Provide default values if user data is available, else use empty strings
  const defaultValues: Partial<ProfileFormValues> = {
    username: user.name || "",
    email: user.email || "",
    bio: "I am a user of InternHub", // Static bio or default
    urls: [
      { value: "https://internhub-05.vercel.app/" },
      { value: "https://internhub-05.vercel.app/auth/signin" },
    ],
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues, // Set default values dynamically
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    name: "urls",
    control: form.control,
  })

  const { toast } = useToast();

  async function onSubmit(data: ProfileFormValues) {
    if (user.uid) {
      const uid = user.uid;
      const userDocRef = doc(db, 'users', uid);

      try {
        const userData = {
          username: user.name,
          newEmail: user.email,
          bio: data.bio,
          urls: data.urls,
        };

        await updateDoc(userDocRef, userData);

        toast({
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully.',
        });
      } catch (error) {
        toast({
          title: 'Error Updating Profile',
          description: 'An error occurred while updating your profile.',
        });
        console.error('Error updating profile:', error);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input readOnly {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a pseudonym.
                You can only change this once every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input readOnly placeholder="abc@gmail.com" {...field} />
              </FormControl>
              <FormDescription>
                You can manage verified email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations to link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <div className="flex items-center space-x-2">
                    <FormControl className="flex-1">
                      <Input {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7H5M10 12V17M14 12V17M3 7h18M7 7V4a1 1 0 011-1h8a1 1 0 011 1v3M5 7h14l1 14H4L5 7z"
                        />
                      </svg>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: "" })}
          >
            Add URL
          </Button>
        </div>

        <Button type="submit" className="dark:bg-gray-900 dark:text-white">
          Update Profile
        </Button>

        <Link href="/profilePage/editProfile" className="ml-10 dark:text-white">
          Change email or User Name
        </Link>
      </form>
    </Form>
  )
}
