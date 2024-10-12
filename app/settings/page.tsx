import { Separator } from '../../components/ui/separator'
import { ProfileForm } from './profile-form'

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6 font-dmsans">
      <div>
        <div className="text-lg font-medium">Profile</div>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  )
}