import { redirect } from "next/navigation";
import ChangePasswordForm from "@/features/user/profile/component/ChangePassword";
import ProfileForm from "@/features/user/profile/component/ProfileForm";
import { auth } from "@/lib/auth";
import { ROLE_ENUM } from "@/lib/enum";
import prisma from "@/lib/prisma";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

export default async function Page() {
  const userAuth = await auth();
  if (!userAuth) return redirect("/");

  const user = await prisma.user.findUnique({
    where: { email: userAuth.user.email! },
  });

  if (!user) return redirect("/");

  return (
    <div className="min-h-screen bg-gray-50 p-6 ">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Mi Perfil</h1>
        <p className="text-gray-600">
          Gestiona tu información personal y preferencias
        </p>
      </div>

      {/* card user*/}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="flex justify-center lg:justify-start">
          <Card className="w-full max-w-full">
            <CardHeader />
            <CardContent className="flex flex-col justify-center items-center gap-3">
              <Avatar className="w-28 h-28">
                <AvatarImage src={user.photo as string} />
                <AvatarFallback className="text-3xl text-white bg-gray-400">
                  {user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <p className="text-gray-800 font-medium text-lg">{user.name}</p>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
              <p className="bg-orange-500 text-white py-1 px-3 rounded-2xl text-sm font-medium">
                {ROLE_ENUM[user.role]}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* information personal */}
        <div className="lg:col-span-2">
          <Card className="w-full">
            <CardContent className="pt-6">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="flex w-full justify-start gap-2 mb-4">
                  <TabsTrigger value="profile" className="px-4 py-2">
                    Perfil
                  </TabsTrigger>
                  <TabsTrigger value="changePassword" className="px-4 py-2">
                    Contraseña
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-2">
                  <ProfileForm
                    user={{
                      name: user.name,
                      email: user.email,
                      telephone: user.telephone,
                      createdAt: user.createdAt,
                    }}
                  />
                </TabsContent>

                <TabsContent value="changePassword" className="mt-2">
                  <ChangePasswordForm
                    userId={user.id}
                    hasPassword={!!user.password}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* information aditional when is trainer */}
    </div>
  );
}
