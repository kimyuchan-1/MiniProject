package com.kdt03.ped_accident.api.controller;

import com.kdt03.ped_accident.api.dto.request.CreateInvestmentPlanRequest;
import com.kdt03.ped_accident.api.dto.response.AccidentPrediction;
import com.kdt03.ped_accident.api.dto.response.DashboardStats;
import com.kdt03.ped_accident.domain.investment.entity.InvestmentPlan;
import com.kdt03.ped_accident.global.config.auth.CustomUserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DashboardController {

    // 여러 도메인의 서비스들을 주입받습니다.
    private final DataImportService dataImportService;
    private final PredictionService predictionService;
    private final InvestmentService investmentService;

   
    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<DashboardStats> getDashboardStats(
            @RequestParam(required = false) String sido,
            @RequestParam(required = false) String sigungu) {
        DashboardStats stats = safetyAnalysisService.getDashboardStats(sido, sigungu);
        return ResponseEntity.ok(stats);
    }

  
    @PostMapping("/admin/import/crosswalks")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ImportResult> importCrosswalks(@RequestParam("file") MultipartFile file) {
        // DataImportService를 호출하여 CSV 파일 처리
        dataImportService.importCrosswalkData(file);
        
        // 실제 구현에서는 서비스 계층에서 처리 결과를 담은 ImportResult 객체를 반환해야 합니다.
        // 여기서는 성공적으로 프로세스가 시작되었음을 가정하고 임시 결과를 반환합니다.
        ImportResult result = new ImportResult(0, 0, 0, "Import process has been initiated.");
        return ResponseEntity.ok(result);
    }
}
