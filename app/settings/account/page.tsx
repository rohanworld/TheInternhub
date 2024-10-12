import { Separator } from '../../../components/ui/separator'
import { AccountForm } from "./account-form"

export default function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-lg font-medium  pl-1 dark:text-white">Account</div>
        <p className="text-sm text-muted-foreground">
          Update your account settings. Set your preferred language and
          timezone.
        </p>
      </div>
      <Separator />
      <AccountForm />
    </div>
  )
}