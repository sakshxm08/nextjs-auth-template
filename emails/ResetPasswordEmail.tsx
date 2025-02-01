import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordEmailProps {
  username?: string;
  resetPasswordLink?: string;
}

export const ResetPasswordEmail = ({
  username,
  resetPasswordLink,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Here is your link to reset the password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Heading style={heading}>Project Name</Heading>
            <Text style={text}>
              Hi <b>@{username}</b>,
            </Text>
            <Text style={text}>
              Someone recently requested a password change for your [Project
              Name] account. If this was you, you can set a new password here:
            </Text>
            <Button style={button} href={resetPasswordLink}>
              Reset password
            </Button>
            <Text style={text}>
              If you don&apos;t want to change your password or didn&apos;t
              request this, just ignore and delete this message.
            </Text>
            <Text style={text}>
              To keep your account secure, please don&apos;t forward this email
              to anyone.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

ResetPasswordEmail.PreviewProps = {
  userFirstname: "testuser",
  resetPasswordLink: "https://untitled.com",
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const heading = {
  fontSize: "24px",
  fontWeight: 700,
  color: "#202020",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#020817",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};
