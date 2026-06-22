package org.example.fitness.Control;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.example.fitness.Service.SportRecordService;
import org.example.fitness.Service.AiService;
import org.example.fitness.entity.SportRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sport")
public class SportRecordControl {
    @Autowired
    private SportRecordService sportRecordService;
    @Autowired
    private AiService aiService;
    //添加记录
    @PostMapping ("/add")
    Map<String,Object> add(@RequestBody SportRecord sportRecord){
        Map<String, Object> result = new HashMap<>();
        
        // 如果没有卡路里，用AI分析
        if (sportRecord.getCalories() == null || sportRecord.getCalories() == 0) {
            int calories = aiService.analyzeSport(sportRecord.getExerciseName(), sportRecord.getDuration());
            sportRecord.setCalories(calories);
        }
        
        boolean success = sportRecordService.save(sportRecord);
        if( success){
            result.put("code", 200);
            result.put("message", "添加成功！");
            result.put("calories", sportRecord.getCalories());
        }else {
            result.put("code", 400);
            result.put("message", "添加失败！");
        }
        return result;
    }
    //查询记录（date可选，不传则查所有）
    @GetMapping("/list")
    public Map<String,Object>list(@RequestParam Integer userId, @RequestParam(required = false) String date){
        Map<String, Object> result = new HashMap<>();
        LambdaQueryWrapper<SportRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SportRecord::getUserId, userId);
        if (date != null && !date.isEmpty()) {
            wrapper.eq(SportRecord::getRecordDate, date);
        }
        wrapper.orderByDesc(SportRecord::getCreatedAt);
        List<SportRecord> list = sportRecordService.list(wrapper);
        result.put("code", 200);
        result.put("data", list);
        return result;
    }
//删除记录
    @DeleteMapping("/delete/{id}")
    public Map<String, Object> delete(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        boolean success = sportRecordService.removeById(id);
        if (success) {
            result.put("code", 200);
            result.put("message", "删除成功");
        } else {
            result.put("code", 400);
            result.put("message", "删除失败");
        }
        return result;
    }


}
