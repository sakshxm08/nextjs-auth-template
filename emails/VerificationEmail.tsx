import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  username?: string;
  code?: string;
}

export default function VerificationEmail({
  username,
  code = "596853",
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Here is your verification code</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Heading style={heading}>Project Name</Heading>

            <Text style={text}>
              Hi <b>@{username}</b>,
            </Text>
            <Heading style={h1}>Verify your email address</Heading>
            <Text style={mainText}>
              Thanks for starting the new [Project Name] account creation
              process. We want to make sure it&apos;s really you. Please enter
              the following verification code when prompted. If you don&apos;t
              want to create an account, you can ignore this message.
            </Text>
            <Section style={verificationSection}>
              <Text style={verifyText}>Verification code</Text>

              <Text style={codeText}>{code}</Text>
              <Text style={validityText}>
                (This code is valid for 10 minutes)
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
  letterSpacing: "",
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

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "20px",
  fontWeight: "600",
  marginBottom: "15px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const verifyText = {
  ...text,
  margin: 0,
  fontWeight: "bold",
  textAlign: "center" as const,
};

const codeText = {
  ...text,
  fontWeight: "bold",
  fontSize: "36px",
  margin: "10px 0",
  textAlign: "center" as const,
};

const validityText = {
  ...text,
  margin: "0px",
  fontWeight: 400,
  textAlign: "center" as const,
};

const verificationSection = {
  alignItems: "center",
  justifyContent: "center",
};

const mainText = { ...text, marginBottom: "14px" };
