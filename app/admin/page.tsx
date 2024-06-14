"use client";

import React, { useCallback, useEffect, useRef } from "react";
import styles from "@styles/admin.module.css";
import Button from "@components/UI/button";
import { useRouter } from "next/navigation";
import { AdminService } from "@services/authService";
import { useNotification } from "@context/NotificationProvider";
import { getUserFromJwt } from "@utils/jwt";

export default function Page() {
  const router = useRouter();
  const password = useRef<HTMLInputElement>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    const user = getUserFromJwt();
    if (!user) return;
    router.push("/admin/quests");
  }, []);

  const handleAdminLogin = useCallback(async () => {
    try {
      if (!password.current) return console.error("Password field not found");
      const passcode = password?.current.value;
      const response = await AdminService.login({ passcode });
      if (!response) showNotification("Invalid passcode", "error");
      localStorage.setItem("token", response.token);
      router.push("/admin/quests");
    } catch (error) {
      console.log("Error while logging in", error);
    }
  }, [password]);

  return (
    <div className={styles.screen}>
      <div className={styles.banner}>
        <div className="flex flex-col justify-evenly">
          <div className="flex flex-col gap-4">
            <p className={styles.subtitleText}>Quest Overview</p>
            <h1 className={styles.headingText}>Admin quest control</h1>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="fname">Passcode:</label>
            <input
              ref={password}
              className={styles.input}
              id="fname"
              type="password"
            />
          </div>
          <div className="w-fit">
            <Button onClick={handleAdminLogin}>
              Access the admin dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
