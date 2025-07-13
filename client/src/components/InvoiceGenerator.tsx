import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Check, Printer } from 'lucide-react';

interface InvoiceData {
  id: string;
  date: string;
  recipientName: string;
  recipientRole: string;
  amount: number;
  commission: number;
  platformFee: number;
  netAmount: number;
  period: string;
  services: {
    name: string;
    amount: number;
    commissionRate: number;
  }[];
}

interface InvoiceGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  settlement: any;
  onInvoiceGenerated: (invoiceData: InvoiceData) => void;
}

export function InvoiceGenerator({ isOpen, onClose, settlement, onInvoiceGenerated }: InvoiceGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<InvoiceData | null>(null);

  const generateInvoice = async () => {
    setIsGenerating(true);
    
    // 계산서 데이터 생성
    const invoiceData: InvoiceData = {
      id: `INV-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      recipientName: settlement.name,
      recipientRole: settlement.role,
      amount: settlement.earningsTotal,
      commission: Math.round(settlement.earningsTotal * 0.15),
      platformFee: Math.round(settlement.earningsTotal * 0.03),
      netAmount: Math.round(settlement.earningsTotal * 0.82),
      period: '2025-07-01 ~ 2025-07-31',
      services: [
        {
          name: '화상상담 수수료',
          amount: Math.round(settlement.earningsTotal * 0.4),
          commissionRate: 15
        },
        {
          name: '강의 판매 수수료',
          amount: Math.round(settlement.earningsTotal * 0.35),
          commissionRate: 12
        },
        {
          name: '상품 추천 수수료',
          amount: Math.round(settlement.earningsTotal * 0.25),
          commissionRate: 8
        }
      ]
    };

    // 실제 환경에서는 API 호출
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setGeneratedInvoice(invoiceData);
    setIsGenerating(false);
    onInvoiceGenerated(invoiceData);
  };

  const downloadInvoice = () => {
    if (!generatedInvoice) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>정산 계산서</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-info { margin-bottom: 20px; }
          .invoice-info { margin-bottom: 20px; }
          .services-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .services-table th, .services-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .services-table th { background-color: #f2f2f2; }
          .total-section { margin-top: 20px; }
          .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .final-total { font-weight: bold; font-size: 18px; color: #2563eb; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>TALEZ 정산 계산서</h1>
          <p>계산서 번호: ${generatedInvoice.id}</p>
          <p>발행일: ${generatedInvoice.date}</p>
        </div>
        
        <div class="company-info">
          <h3>발행자 정보</h3>
          <p>회사명: (주)테일즈</p>
          <p>주소: 서울시 강남구 테헤란로 123</p>
          <p>전화: 02-123-4567</p>
          <p>이메일: admin@talez.com</p>
        </div>
        
        <div class="invoice-info">
          <h3>수취인 정보</h3>
          <p>성명: ${generatedInvoice.recipientName}</p>
          <p>역할: ${generatedInvoice.recipientRole}</p>
          <p>정산 기간: ${generatedInvoice.period}</p>
        </div>
        
        <table class="services-table">
          <thead>
            <tr>
              <th>서비스</th>
              <th>수수료율</th>
              <th>정산 금액</th>
            </tr>
          </thead>
          <tbody>
            ${generatedInvoice.services.map(service => `
              <tr>
                <td>${service.name}</td>
                <td>${service.commissionRate}%</td>
                <td>${service.amount.toLocaleString()}원</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">
            <span>총 수수료 수익:</span>
            <span>${generatedInvoice.amount.toLocaleString()}원</span>
          </div>
          <div class="total-row">
            <span>플랫폼 수수료 (3%):</span>
            <span>-${generatedInvoice.platformFee.toLocaleString()}원</span>
          </div>
          <div class="total-row final-total">
            <span>실지급액:</span>
            <span>${generatedInvoice.netAmount.toLocaleString()}원</span>
          </div>
        </div>
        
        <div style="margin-top: 40px; text-align: center;">
          <p>본 계산서는 TALEZ 플랫폼에서 자동 생성되었습니다.</p>
          <p>문의사항이 있으시면 admin@talez.com으로 연락주세요.</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${generatedInvoice.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printInvoice = () => {
    if (!generatedInvoice) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>정산 계산서</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-info { margin-bottom: 20px; }
          .invoice-info { margin-bottom: 20px; }
          .services-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .services-table th, .services-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .services-table th { background-color: #f2f2f2; }
          .total-section { margin-top: 20px; }
          .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .final-total { font-weight: bold; font-size: 18px; color: #2563eb; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>TALEZ 정산 계산서</h1>
          <p>계산서 번호: ${generatedInvoice.id}</p>
          <p>발행일: ${generatedInvoice.date}</p>
        </div>
        
        <div class="company-info">
          <h3>발행자 정보</h3>
          <p>회사명: (주)테일즈</p>
          <p>주소: 서울시 강남구 테헤란로 123</p>
          <p>전화: 02-123-4567</p>
          <p>이메일: admin@talez.com</p>
        </div>
        
        <div class="invoice-info">
          <h3>수취인 정보</h3>
          <p>성명: ${generatedInvoice.recipientName}</p>
          <p>역할: ${generatedInvoice.recipientRole}</p>
          <p>정산 기간: ${generatedInvoice.period}</p>
        </div>
        
        <table class="services-table">
          <thead>
            <tr>
              <th>서비스</th>
              <th>수수료율</th>
              <th>정산 금액</th>
            </tr>
          </thead>
          <tbody>
            ${generatedInvoice.services.map(service => `
              <tr>
                <td>${service.name}</td>
                <td>${service.commissionRate}%</td>
                <td>${service.amount.toLocaleString()}원</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">
            <span>총 수수료 수익:</span>
            <span>${generatedInvoice.amount.toLocaleString()}원</span>
          </div>
          <div class="total-row">
            <span>플랫폼 수수료 (3%):</span>
            <span>-${generatedInvoice.platformFee.toLocaleString()}원</span>
          </div>
          <div class="total-row final-total">
            <span>실지급액:</span>
            <span>${generatedInvoice.netAmount.toLocaleString()}원</span>
          </div>
        </div>
        
        <div style="margin-top: 40px; text-align: center;">
          <p>본 계산서는 TALEZ 플랫폼에서 자동 생성되었습니다.</p>
          <p>문의사항이 있으시면 admin@talez.com으로 연락주세요.</p>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            계산서 발행
          </DialogTitle>
          <DialogDescription>
            {settlement?.name}님의 정산 계산서를 발행합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!generatedInvoice ? (
            <Card>
              <CardHeader>
                <CardTitle>정산 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">수취인</p>
                    <p className="font-medium">{settlement?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">역할</p>
                    <Badge variant="outline">{settlement?.role}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">총 수익</p>
                    <p className="font-medium">{settlement?.earningsTotal?.toLocaleString()}원</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">정산 기간</p>
                    <p className="font-medium">2025-07-01 ~ 2025-07-31</p>
                  </div>
                </div>
                
                <div className="flex justify-center pt-4">
                  <Button onClick={generateInvoice} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        계산서 생성 중...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        계산서 생성
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  계산서 생성 완료
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">계산서 번호</p>
                    <p className="font-medium">{generatedInvoice.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">발행일</p>
                    <p className="font-medium">{generatedInvoice.date}</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-3">정산 내역</h4>
                  <div className="space-y-2">
                    {generatedInvoice.services.map((service, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-sm">{service.name}</span>
                        <span className="text-sm font-medium">{service.amount.toLocaleString()}원</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-sm">총 수수료 수익</span>
                        <span className="text-sm font-medium">{generatedInvoice.amount.toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">플랫폼 수수료 (3%)</span>
                        <span className="text-sm font-medium text-red-600">-{generatedInvoice.platformFee.toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="font-medium">실지급액</span>
                        <span className="font-medium text-blue-600">{generatedInvoice.netAmount.toLocaleString()}원</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-center">
                  <Button onClick={downloadInvoice} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    계산서 다운로드
                  </Button>
                  <Button onClick={printInvoice} variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    인쇄
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}