package org.example.fitness.Service;

public interface AiService {
    // 综合分析：用户信息+饮食+运动
    String analyze(String userInfo, String dietInfo, String sportInfo);
    
    // 分析食物热量
    int analyzeFood(String foodName);
    
    // 分析运动消耗
    int analyzeSport(String sportName, int duration);
}
