# Hospital Admin Dashboard

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documenting the process

[22 hours in the making and recording the whole process.](https://www.youtube.com/playlist?list=PL_sapWkWdZHFgg8IGTAzP4o-prtaC1Bi5)

### [UI Design Inspiration](https://xd.adobe.com/view/121254c9-532f-4772-a1ba-dfe529a96b39-4741/specs/)


### [Strategy & reflections](https://docs.google.com/document/d/1mfTL8u_--NVGQAF-QkP7Yw5e8_Cwq5qnsY8liEd2XnM/edit)

[![demo-pwa-barcode-scanner](https://i.imgflip.com/8u86nj.gif)](https://admin-hospital-101.vercel.app/)



```
GaitWise-New-Web
├─ .eslintrc.json
├─ app
│  ├─ (pages)
│  │  ├─ auth
│  │  │  ├─ ForgetPass.tsx
│  │  │  ├─ organization.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ ResetPass.tsx
│  │  │  └─ Signup.tsx
│  │  ├─ createproject
│  │  │  └─ page.tsx
│  │  ├─ createsurvey
│  │  │  └─ page.tsx
│  │  ├─ organzation
│  │  │  ├─ data.tsx
│  │  │  └─ [...organizationName]
│  │  │     └─ page.tsx
│  │  ├─ participant
│  │  │  └─ page.tsx
│  │  └─ test
│  │     └─ page.tsx
│  ├─ api
│  │  ├─ analyst
│  │  │  ├─ invite-email
│  │  │  │  └─ route.ts
│  │  │  ├─ signin
│  │  │  │  └─ route.ts
│  │  │  ├─ signout
│  │  │  │  └─ route.ts
│  │  │  └─ signup
│  │  │     └─ route.ts
│  │  ├─ auth
│  │  │  ├─ email
│  │  │  │  └─ route.ts
│  │  │  ├─ reset-password
│  │  │  │  └─ route.ts
│  │  │  └─ verify-code
│  │  │     └─ route.ts
│  │  ├─ doctor
│  │  │  ├─ signin
│  │  │  │  └─ route.ts
│  │  │  └─ signup
│  │  │     └─ route.ts
│  │  ├─ organization
│  │  │  ├─ create
│  │  │  │  └─ route.ts
│  │  │  ├─ pagedetails
│  │  │  │  └─ route.ts
│  │  │  └─ search
│  │  │     └─ route.ts
│  │  └─ project
│  │     └─ search
│  │        └─ route.ts
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ hooks
│  │  ├─ useAuth.ts
│  │  └─ useOrganizationDetails.ts
│  ├─ layout.tsx
│  ├─ lib
│  │  ├─ registry.tsx
│  │  └─ services
│  │     ├─ const.tsx
│  │     └─ Patients.ts
│  ├─ loading.tsx
│  └─ providers.tsx
├─ components
│  ├─ ClientLayout.tsx
│  ├─ common
│  │  ├─ Divider.tsx
│  │  └─ Navbar.tsx
│  ├─ icons
│  │  ├─ ArrowDown.tsx
│  │  ├─ ArrowUp.tsx
│  │  ├─ CalendarIcon.tsx
│  │  ├─ ChatBubbleIcon.tsx
│  │  ├─ CreditCardIcon.tsx
│  │  ├─ DownloadIcon.tsx
│  │  ├─ ExpandMore.tsx
│  │  ├─ FemaleIcon.tsx
│  │  ├─ GenderMark.tsx
│  │  ├─ groupIcon.tsx
│  │  ├─ HomeIcon.tsx
│  │  ├─ IdCard.tsx
│  │  ├─ index.tsx
│  │  ├─ InsuranceIcon.tsx
│  │  ├─ MenuIcon.tsx
│  │  ├─ PencilIcon.tsx
│  │  ├─ PhoneIcon.tsx
│  │  ├─ SearchIcon.tsx
│  │  ├─ SettingIcon.tsx
│  │  ├─ Survey.tsx
│  │  └─ TestLogo.tsx
│  ├─ index.tsx
│  ├─ LoadingSpinner.tsx
│  ├─ organzation
│  │  ├─ AnalystList.tsx
│  │  ├─ OrganzationTitle.tsx
│  │  └─ ProjectCard.tsx
│  └─ participants
│     ├─ BaseCardDiagnosis.tsx
│     ├─ DiagnosisHistory.tsx
│     ├─ DiagnosticList.tsx
│     ├─ LabResultList.tsx
│     ├─ ParticipantHeader.tsx
│     ├─ ParticipantsList.tsx
│     ├─ ParticipantsProfile.tsx
│     └─ ProjectList.tsx
├─ db
│  ├─ actions
│  │  └─ analyst.ts
│  ├─ dbConnect.ts
│  └─ models
│     ├─ accGyroRot.ts
│     ├─ analysis_report.ts
│     ├─ analyst.ts
│     ├─ doctor.ts
│     ├─ organization.ts
│     ├─ post.ts
│     ├─ project.ts
│     ├─ reservation.ts
│     ├─ survey.ts
│     ├─ test.ts
│     ├─ user.ts
│     ├─ VerificationCode.ts
│     └─ walking.ts
├─ middleware.ts
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ images
│  │  ├─ 8b1deecf1843ac90f969831ecb53477e.png
│  │  ├─ gaitwise-logo.svg
│  │  ├─ gaitwise-logo1.svg
│  │  ├─ gaitwise.svg
│  │  ├─ HeartBPM.png
│  │  ├─ HeartBPM@2x.png
│  │  ├─ patienceprofile2x.png
│  │  ├─ patientprofile.png
│  │  ├─ respiratoryrate.png
│  │  ├─ respiratoryrate@2x.png
│  │  ├─ temperature.png
│  │  └─ temperature@2x.png
│  ├─ index.tsx
│  └─ svg
│     ├─ gaitwise-logo.svg
│     ├─ gaitwise-logo1.svg
│     ├─ gaitwise.svg
│     ├─ gender-mark-1-svgrepo-com.svg
│     ├─ id-card-svgrepo-com.svg
│     ├─ pencil-svgrepo-com.svg
│     ├─ survey-svgrepo-com.svg
│     └─ user-svgrepo-com.svg
├─ README.md
├─ tailwind.config.ts
├─ tsconfig.json
├─ types
│  ├─ AccGyroRot.ts
│  ├─ Analyst.ts
│  ├─ index.ts
│  ├─ Organization.ts
│  ├─ Post.ts
│  ├─ Project.ts
│  ├─ Survey.ts
│  ├─ User.ts
│  ├─ VerificationCode.ts
│  ├─ Walking.ts
│  └─ Weight.ts
└─ utils
   ├─ chartMockData.ts
   ├─ defaultImage.tsx
   ├─ diagnosisMockData.ts
   ├─ diagnosticTableMockData.ts
   ├─ formatDate.ts
   ├─ index.ts
   ├─ labResultsMockData.ts
   ├─ participantsMockData.ts
   └─ RandomImage.ts

```