package com.shabuyaki.service;

import com.shabuyaki.dto.request.UpdateTableStatusRequest;
import com.shabuyaki.dto.response.TableResponse;
import com.shabuyaki.entity.RestaurantTable;
import com.shabuyaki.exception.ResourceNotFoundException;
import com.shabuyaki.repository.RestaurantTableRepository;
import com.shabuyaki.websocket.WebSocketEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TableService {

    private final RestaurantTableRepository tableRepository;
    private final WebSocketEventPublisher eventPublisher;

    @Transactional(readOnly = true)
    public List<TableResponse> getAllTables() {
        return tableRepository.findAllByOrderByTableNumberAsc().stream()
                .map(TableResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TableResponse getTableById(Long id) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));
        return TableResponse.from(table);
    }

    /**
     * Updates table status and broadcasts the change to all connected admin clients
     * via WebSocket so the table map updates in real time without polling.
     */
    @Transactional
    public TableResponse updateTableStatus(Long id, UpdateTableStatusRequest request) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));

        RestaurantTable.TableStatus newStatus =
                RestaurantTable.TableStatus.valueOf(request.getStatus());

        table.setStatus(newStatus);
        RestaurantTable saved = tableRepository.save(table);

        TableResponse response = TableResponse.from(saved);

        // Broadcast to all admin clients subscribed to /topic/tables
        eventPublisher.publishTableStatusChanged(response);

        log.info("Table {} status updated to {}", saved.getTableNumber(), newStatus);
        return response;
    }
}
