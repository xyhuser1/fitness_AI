package org.example.fitness.Control;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.example.fitness.DAO.UserMapper;
import org.example.fitness.DAO.DietMapper;
import org.example.fitness.DAO.SportMapper;
import org.example.fitness.Service.AiService;
import org.example.fitness.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai")
public class    AiController {

    @Autowired
    private AiService aiService;
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private DietMapper dietMapper;
    
    @Autowired
    private SportMapper sportMapper;

    @GetMapping("/analyze")
    public Map<String, Object> analyze(@RequestParam Integer userId) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 1. 获取用户信息
            User user = userMapper.selectById(userId);
            if (user == null) {
                result.put("code", 400);
                result.put("message", "用户不存在");
                return result;
            }
            
            String userInfo = "身高: " + (user.getHeight() != null ? user.getHeight() + "cm" : "未填写") +
                             ", 体重: " + (user.getWeight() != null ? user.getWeight() + "kg" : "未填写") +
                             ", 性别: " + (user.getGender() == 1 ? "男" : "女");
            
            // 2. 获取今日饮食记录
            LambdaQueryWrapper<DietRecord> dietWrapper = new LambdaQueryWrapper<>();
            dietWrapper.eq(DietRecord::getUserId, userId)
                       .eq(DietRecord::getRecordDate, LocalDate.now());
            List<DietRecord> dietList = dietMapper.selectList(dietWrapper);
            
            String dietInfo = dietList.isEmpty() ? "无记录" : 
                dietList.stream()
                    .map(d -> d.getMealType() + ": " + d.getFoodName() + 
                         (d.getCalories() != null ? " (" + d.getCalories() + "kcal)" : ""))
                    .collect(Collectors.joining("\n"));
            
            // 3. 获取今日运动记录
            LambdaQueryWrapper<SportRecord> sportWrapper = new LambdaQueryWrapper<>();
            sportWrapper.eq(SportRecord::getUserId, userId)
                        .eq(SportRecord::getRecordDate, LocalDate.now());
            List<SportRecord> sportList = sportMapper.selectList(sportWrapper);
            
            String sportInfo = sportList.isEmpty() ? "无记录" :
                sportList.stream()
                    .map(s -> s.getExerciseName() + " " + s.getDuration() + "分钟" +
                         (s.getCalories() != null ? " (" + s.getCalories() + "kcal)" : ""))
                    .collect(Collectors.joining("\n"));
            
            // 4. 调用AI分析
            String aiResult = aiService.analyze(userInfo, dietInfo, sportInfo);
            
            result.put("code", 200);
            result.put("data", aiResult);
            
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "分析失败: " + e.getMessage());
        }
        
        return result;
    }
}
