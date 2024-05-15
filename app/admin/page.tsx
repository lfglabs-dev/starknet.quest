"use client";

import React, { useCallback, useRef } from "react";
import styles from "@styles/admin.module.css";
import Button from "@components/UI/button";
import { useRouter } from "next/navigation";
import { AdminService } from "@services/authService";

export default function Page() {
  const router = useRouter();
  const password = useRef<string | null>(null);

  const handleAdminLogin = useCallback(async () => {
    try {
      const passcode = password?.current?.value;
      const response = await AdminService.login({ passcode });
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
              className={styles.passwordField}
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
