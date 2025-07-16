<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class PayslipController extends Controller
{
    /**
     * Get all payslip data with optional filtering
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // For demo purposes, load from JSON file
            // In production, this would come from database
            $jsonPath = resource_path('views/react/Dashboard/Payslip/data/payslipdata.json');
            
            if (!file_exists($jsonPath)) {
                return response()->json([
                    'error' => 'Data payslip tidak ditemukan'
                ], 404);
            }
            
            $payslipData = json_decode(file_get_contents($jsonPath), true);
            
            // Apply filters if provided
            $employeeName = $request->get('employee_name');
            $employeeNik = $request->get('employee_nik');
            $year = $request->get('year');
            $month = $request->get('month');
            
            if ($employeeName || $employeeNik || $year || $month) {
                $payslipData = array_filter($payslipData, function ($item) use ($employeeName, $employeeNik, $year, $month) {
                    $nameMatch = !$employeeName || stripos($item['kolom_name'], $employeeName) !== false;
                    $nikMatch = !$employeeNik || strpos($item['kolom_ktp'], $employeeNik) !== false;
                    
                    $dateMatch = true;
                    if ($year || $month) {
                        $itemDate = new \DateTime($item['kolom_month']);
                        $itemYear = $itemDate->format('Y');
                        $itemMonth = $itemDate->format('m');
                        
                        $yearMatch = !$year || $itemYear === $year;
                        $monthMatch = !$month || $itemMonth === $month;
                        
                        $dateMatch = $yearMatch && $monthMatch;
                    }
                    
                    return $nameMatch && $nikMatch && $dateMatch;
                });
                
                // Reindex array after filtering
                $payslipData = array_values($payslipData);
            }
            
            // Add pagination if requested
            $page = (int) $request->get('page', 1);
            $perPage = (int) $request->get('per_page', 10);
            
            if ($request->has('page')) {
                $total = count($payslipData);
                $offset = ($page - 1) * $perPage;
                $payslipData = array_slice($payslipData, $offset, $perPage);
                
                return response()->json([
                    'data' => $payslipData,
                    'meta' => [
                        'current_page' => $page,
                        'per_page' => $perPage,
                        'total' => $total,
                        'last_page' => ceil($total / $perPage)
                    ]
                ]);
            }
            
            return response()->json($payslipData);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal memuat data payslip',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get specific payslip by ID
     */
    public function show($id): JsonResponse
    {
        try {
            $jsonPath = resource_path('views/react/Dashboard/Payslip/data/payslipdata.json');
            
            if (!file_exists($jsonPath)) {
                return response()->json([
                    'error' => 'Data payslip tidak ditemukan'
                ], 404);
            }
            
            $payslipData = json_decode(file_get_contents($jsonPath), true);
            
            $payslip = collect($payslipData)->firstWhere('id', (int) $id);
            
            if (!$payslip) {
                return response()->json([
                    'error' => 'Payslip tidak ditemukan'
                ], 404);
            }
            
            return response()->json($payslip);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal memuat detail payslip',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Download payslip as PDF
     */
    public function download($id): JsonResponse
    {
        try {
            // This is a placeholder for PDF generation
            // In production, you would generate actual PDF here
            
            $payslip = $this->show($id);
            
            if ($payslip->getStatusCode() !== 200) {
                return $payslip;
            }
            
            $payslipData = $payslip->getData();
            
            return response()->json([
                'message' => 'PDF generation would happen here',
                'employee_name' => $payslipData->kolom_name,
                'period' => $payslipData->kolom_month,
                'download_url' => '/api/payslip/' . $id . '/pdf' // placeholder URL
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal mengunduh payslip',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
