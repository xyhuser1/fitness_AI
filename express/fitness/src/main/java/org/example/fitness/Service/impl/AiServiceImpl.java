package org.example.fitness.Service.impl;

import org.example.fitness.Service.AiService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiServiceImpl implements AiService {
    private static final String API_KEY = "YOUR_DEEPSEEK_API_KEY";
    private static final String API_URL = "https://api.deepseek.com/v1/chat/completions";
    @Override
    public String analyze(String userInfo, String dietInfo, String sportInfo) {
        String prompt = "你是专业营养师和健身教练。根据用户信息和今日记录进行分析。\n\n" +
                "【用户信息】\n" + userInfo + "\n\n" +
                "【今日饮食记录】\n" + dietInfo + "\n\n" +
                "【今日运动记录】\n" + sportInfo + "\n\n" +
                "请返回JSON格式（不要其他文字）：\n" +
                "{\n" +
                "  \"caloriesIn\": 今日总摄入kcal(数字),\n" +
                "  \"caloriesOut\": 今日总消耗kcal(数字),\n" +
                "  \"balance\": \"热量平衡分析\",\n" +
                "  \"dietAdvice\": \"饮食建议(50字内)\",\n" +
                "  \"sportAdvice\": \"运动建议(50字内)\",\n" +
                "  \"summary\": \"总体建议(50字内)\"\n" +
                "}";

        return callApi(prompt);
    }
    
    @Override
    public int analyzeFood(String foodName) {
        String prompt = "你是营养师，请估算以下食物的总热量(kcal)，只返回数字，不要其他文字：\n" + foodName;
        String result = callApi(prompt);
        try {
            return Integer.parseInt(result.trim().replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return 0;
        }
    }
    
    @Override
    public int analyzeSport(String sportName, int duration) {
        String prompt = "请估算70kg的人" + sportName + duration + "分钟消耗的热量(kcal)，只返回数字：";
        String result = callApi(prompt);
        try {
            return Integer.parseInt(result.trim().replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return 0;
        }
    }
    
    private String callApi(String prompt) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + API_KEY);
//用map来装用户数据
            Map<String, Object> body = new HashMap<>();
            body.put("model", "deepseek-chat");
            body.put("messages", Arrays.asList(
                    Map.of("role", "user", "content", prompt)
            ));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(API_URL, request, Map.class);

            Map<String, Object> result = response.getBody();
            List<Map<String, Object>> choices = (List<Map<String, Object>>) result.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\": \"分析失败: " + e.getMessage() + "\"}";
        }
    }


    }
