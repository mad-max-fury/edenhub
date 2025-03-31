"use client";

import React from "react";
import Link from "next/link";

import { AppLogo } from "../logo/logo";
import { Typography } from "../typography";
import { CONTACT_ITEMS } from "@/constants/data";

interface ContactItem {
  title: string;
  value: string;
  link: string;
}

const EXPLORE_LINKS = [
  { title: "Watches", href: "/watches" },
  { title: "Sunglasses", href: "/sunglasses" },
  { title: "Bracelets", href: "/bracelets" },
  { title: "Wallets", href: "/wallets" },
  { title: "Personalized Gifts", href: "/personalized-gifts" },
];

const COMPANY_LINKS = [
  { title: "About Us", href: "/about" },
  { title: "Contact Us", href: "/contact" },
  { title: "Terms & Conditions", href: "/terms" },
  { title: "Privacy Policy", href: "/privacy" },
];

const SUPPORT_LINKS = [
  { title: "FAQs", href: "/faqs" },
  { title: "Order Tracking", href: "/order-tracking" },
  { title: "Shipping & Returns", href: "/shipping" },
  { title: "Warranty", href: "/warranty" },
];

const SOCIAL_LINKS = [
  {
    title: "LinkedIn",
    href: "https://linkedin.com/company/edenwoodwatchhub",
  },
  {
    title: "Facebook",
    href: "https://facebook.com/edenwoodwatchhub",
  },
  {
    title: "Instagram",
    href: "https://instagram.com/edenwoodwatchhub",
  },
  {
    title: "Pinterest",
    href: "https://pinterest.com/edenwoodwatchhub",
  },
  {
    title: "Twitter",
    href: "https://twitter.com/edenwoodwatchhub",
  },
];

const ContactLink: React.FC<ContactItem> = ({ title, link, value }) => (
  <div className="flex flex-col gap-2">
    <Typography
      variant="h-s"
      fontWeight="medium"
      color="N0"
      className="text-[inherit] transition-all duration-300 ease-in-out"
    >
      {title}
    </Typography>
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline text-card"
    >
      <Typography
        variant="p-m"
        fontWeight="medium"
        color="LB600"
        className="text-[inherit] transition-all duration-300 ease-in-out"
      >
        {value}
      </Typography>
    </a>
  </div>
);

export const Footer: React.FC = () => {
  const date = new Date();
  return (
    <footer className="font-clashDisplay bg-BR500 text-white py-8 sm:py-12 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="flex flex-col md:flex-row items-start w-full gap-8 sm:gap-[clamp(60px,5vw,147px)]">
          {/* Logo and Contact */}
          <div className="w-full sm:max-w-[320px] text-center sm:text-left">
            <div className="flex justify-start">
              <AppLogo size="lg" variant="textHorizontalYellow" />
            </div>

            <div className="flex flex-col gap-6 mt-8 sm:mt-12">
              {CONTACT_ITEMS.map((item) => (
                <ContactLink key={item.title} {...item} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full flex-1">
            {/* Explore Links */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <h4 className="font-semibold text-xs sm:text-base">EXPLORE</h4>
              <div className="flex flex-col gap-2">
                {EXPLORE_LINKS.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="block font-medium text-card text-xs sm:text-sm hover:text-yellow-500 transition-colors"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <h4 className="font-semibold text-xs sm:text-base">COMPANY</h4>
              <div className="flex flex-col gap-2">
                {COMPANY_LINKS.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="block font-medium text-card text-xs sm:text-sm hover:text-yellow-500 transition-colors"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Support Links */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <h4 className="font-semibold text-xs sm:text-base">SUPPORT</h4>
              <div className="flex flex-col gap-2">
                {SUPPORT_LINKS.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="block font-medium text-card text-xs sm:text-sm hover:text-yellow-500 transition-colors"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <h4 className="font-semibold text-xs sm:text-base">
                SOCIAL LINKS
              </h4>
              <div className="flex flex-col gap-2">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.title}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-medium text-card text-xs sm:text-sm hover:text-yellow-500 transition-colors"
                    aria-label={social.title}
                  >
                    {social.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-card">
          <p className="text-xs sm:text-sm text-card">
            {` © ${date.getFullYear()}`} EdenHub. ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
};
