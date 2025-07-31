import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

interface PersonalInfoCardProps {
  personalInfo: Record<string, string>;
  onPersonalInfoChange: (field: string, value: string) => void;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  personalInfo,
  onPersonalInfoChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Your profile details for applications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={personalInfo["First Name"]}
            onChange={(e) => onPersonalInfoChange("First Name", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={personalInfo["Last Name"]}
            onChange={(e) => onPersonalInfoChange("Last Name", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={personalInfo["Mobile Phone Number"]}
            onChange={(e) =>
              onPersonalInfoChange("Mobile Phone Number", e.target.value)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
