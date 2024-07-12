"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "@styles/admin.module.css";
import Button from "@components/UI/button";
import { useRouter } from "next/navigation";
import { AdminService } from "@services/authService";
import { useNotification } from "@context/NotificationProvider";
import { getExpireTimeFromJwt, getUserFromJwt } from "@utils/jwt";
import TextInput from "@components/admin/textInput";
import { TEXT_TYPE } from "@constants/typography";
import Typography from "@components/UI/typography/typography";

export default function Page() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [userDetailsInput, setUserDetailsInput] = useState({
    user: "",
    password: "",
  });

  useEffect(() => {
    const tokenExpiryTime = getExpireTimeFromJwt();
    if (!tokenExpiryTime || tokenExpiryTime < new Date().getTime()) {
      router.push("/admin");
    }

    const username = getUserFromJwt();
    if (username !== "super_user") {
      router.push("/admin");
    }
  }, []);

  const handleInputChanges = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUserDetailsInput((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleUserCreate = useCallback(async () => {
    try {
      if (!userDetailsInput.user || !userDetailsInput.password) {
        showNotification("Please fill in all fields", "error");
        return;
      }
      const response = await AdminService.addUser(userDetailsInput);
      if (!response) showNotification("Error while creating user", "error");
      setUserDetailsInput({ user: "", password: "" });
      showNotification("User created successfully", "success");
    } catch (error) {
      console.log("Error while creating user", error);
    }
  }, [userDetailsInput]);

  return (
    <div className={styles.screen}>
      <div className={styles.banner}>
        <div className="flex flex-1 w-full p-6">
          <div className="flex flex-col justify-evenly gap-4">
            <div className="flex flex-col gap-4">
              <h1 className={styles.headingText}>Admin quest control</h1>
            </div>
            <div className="flex flex-col gap-1">
              <TextInput
                onChange={handleInputChanges}
                value={userDetailsInput.user ?? ""}
                name="user"
                label="User"
                placeholder="Username"
              />
              <Typography type={TEXT_TYPE.BODY_MICRO} color="textGray">
                Name of the issuer of the quest
              </Typography>
            </div>
            <div className="flex flex-col gap-1">
              <TextInput
                onChange={handleInputChanges}
                value={userDetailsInput.password ?? ""}
                name="password"
                label="Password"
                placeholder="password"
              />
              <Typography type={TEXT_TYPE.BODY_MICRO} color="textGray">
                Password to be used by the user (enter only numbers)
              </Typography>
            </div>
            <div className="w-fit">
              <Button onClick={handleUserCreate}>Add user</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
