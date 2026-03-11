package com.goldmonitor;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:sqlite::memory:",
    "ollama.host=http://localhost:11434",
    "ollama.model=qwen2:1.5b",
    "allowed.origins=http://localhost:4200"
})
class GoldMonitorApplicationTests {

    @Test
    void contextLoads() {
    }
}
