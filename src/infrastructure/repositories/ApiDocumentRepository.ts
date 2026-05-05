import axios from "axios";
import type { Document, DocumentListResponse, UploadDocumentResponse } from "../../domain/models/Document";
import type { DocumentRepository, UploadDocumentPayload } from "../../domain/repositories/DocumentRepository";

import Cookies from "js-cookie";

export class ApiDocumentRepository implements DocumentRepository {
  private baseUrl = import.meta.env.PUBLIC_BASE_URL;

  private getAuthHeaders() {
    const token = Cookies.get("auth_token");
    return {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async getDocuments(): Promise<Document[]> {
    try {
      const response = await axios.get<DocumentListResponse>(
        `${this.baseUrl}/api/documents`,
        { headers: this.getAuthHeaders() }
      );
      
      const documents = response.data?.data?.documents;
      
      if (Array.isArray(documents)) {
        return documents;
      }
      
      console.warn("[ApiDocumentRepository] Expected documents array but got:", documents);
      return [];
    } catch (error: any) {
      console.error("[ApiDocumentRepository] Get Documents Error:", error?.response?.data || error.message);
      throw error;
    }
  }

  async uploadDocument(payload: UploadDocumentPayload): Promise<any> {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("title", payload.title);
    if (payload.category) {
      formData.append("category", payload.category);
    }

    try {
      const response = await axios.post<UploadDocumentResponse>(
        `${this.baseUrl}/api/documents`,
        formData,
        {
          headers: this.getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("[ApiDocumentRepository] Upload Error:", error);
      if (axios.isAxiosError(error)) {
        console.error("[ApiDocumentRepository] Response Data:", error.response?.data);
        console.error("[ApiDocumentRepository] Response Status:", error.response?.status);
        console.error("[ApiDocumentRepository] Response Headers:", error.response?.headers);
      }
      throw error;
    }
  }

  async updateDocument(id: string, payload: Partial<UploadDocumentPayload>): Promise<any> {
    const response = await axios.patch(
      `${this.baseUrl}/api/documents/${id}`,
      payload,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async deleteDocument(id: string): Promise<any> {
    const response = await axios.delete(
      `${this.baseUrl}/api/documents/${id}`,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async viewDocument(id: string): Promise<Blob> {
    const token = Cookies.get("auth_token");
    const response = await fetch(`${this.baseUrl}/api/documents/${id}/view`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf, text/plain",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to view document: ${response.statusText}`);
    }

    return await response.blob();
  }
}
