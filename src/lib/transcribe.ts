import { GraphQLClient } from '@/lib/graphql-client';

// Hand-authored: transcribeDocument is a brand-new mutation not yet in the
// generated queries/mutations files (schema shipped, awaiting deploy +
// codegen refresh) — same isolation pattern used for Course.instructor
// earlier, so it doesn't touch (or risk breaking) any generated operation.
const transcribeDocumentMutation = /* GraphQL */ `
  mutation TranscribeDocument($fileUrl: AWSURL!) {
    transcribeDocument(fileUrl: $fileUrl)
  }
`;

export async function transcribeDocument(fileUrl: string): Promise<string> {
  const { transcribeDocument: text } = await GraphQLClient.execute<{ transcribeDocument: string }>(
    transcribeDocumentMutation,
    { fileUrl }
  );
  return text;
}
