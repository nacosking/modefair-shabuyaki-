package com.shabuyaki.controller;

import com.shabuyaki.dto.request.UpdateTableStatusRequest;
import com.shabuyaki.dto.response.ApiResponse;
import com.shabuyaki.dto.response.TableResponse;
import com.shabuyaki.service.TableService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tables")
@RequiredArgsConstructor
public class AdminTableController {

    private final TableService tableService;

    /**
     * GET /api/admin/tables
     * Returns all 20 tables with their current status for the admin table map.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TableResponse>>> getAllTables() {
        return ResponseEntity.ok(ApiResponse.ok(tableService.getAllTables()));
    }

    /** GET /api/admin/tables/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TableResponse>> getTable(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(tableService.getTableById(id)));
    }

    /**
     * PUT /api/admin/tables/{id}/status
     * Updates table status and broadcasts via WebSocket to all admin clients.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TableResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTableStatusRequest request) {
        TableResponse updated = tableService.updateTableStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Table status updated", updated));
    }
}
