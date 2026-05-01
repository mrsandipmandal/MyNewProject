import type { RagDocument } from '../../types';

interface DocumentChunk {
  id: string;
  documentId: string;
  text: string;
  embedding?: number[];
}

export class RagService {
  private documents: RagDocument[] = [];
  private chunks: DocumentChunk[] = [];

  async indexDocument(file: { uri: string; name: string; type: string }): Promise<RagDocument | null> {
    try {
      const doc: RagDocument = {
        id: Date.now().toString(),
        name: file.name,
        path: file.uri,
        type: file.type as RagDocument['type'],
        size: 0,
        indexedAt: Date.now(),
        chunkCount: 0,
      };

      this.documents.push(doc);
      return doc;
    } catch (error) {
      console.error('Failed to index document:', error);
      return null;
    }
  }

  async searchDocuments(query: string, limit: number = 5): Promise<DocumentChunk[]> {
    const relevant = this.chunks.slice(0, limit);
    return relevant;
  }

  async removeDocument(documentId: string): Promise<boolean> {
    this.documents = this.documents.filter((d) => d.id !== documentId);
    this.chunks = this.chunks.filter((c) => c.documentId !== documentId);
    return true;
  }

  getDocuments(): RagDocument[] {
    return this.documents;
  }
}

export const ragService = new RagService();
