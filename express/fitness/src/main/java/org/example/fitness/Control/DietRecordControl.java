package org.example.fitness.Control;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.example.fitness.Service.AiService;
import org.example.fitness.Service.DietRecordService;
import org.example.fitness.entity.DietRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/diet")
public class DietRecordControl {
    @Autowired
    private DietRecordService dietRecordService;//把服务注入进来
    @Autowired
    private AiService aiService;
    //添加记录
   //创建一个map集合类型为键值对，放在result中
    @PostMapping ("/add")
    //使用map这个集合来返回数据
    public Map<String,Object> add(@RequestBody DietRecord dietRecord){
        Map<String, Object> result = new HashMap<>();
        // 如果没有卡路里，用AI分析
        if (dietRecord.getCalories() == null || dietRecord.getCalories() == 0) {
            int calories = aiService.analyzeFood(dietRecord.getFoodName());
            dietRecord.setCalories(calories);
        }
        boolean success = dietRecordService.save(dietRecord);
          if( success){
            result.put("code", 200);
            result.put("message", "添加成功！");
            result.put("calories", dietRecord.getCalories());
          }
          else {
              result.put("code", 400);
              result.put("message", "添加失败！");
          }
          return result;
    }
//查询用户某天的记录
@GetMapping("/list")
    public Map<String,Object>list(@RequestParam Integer userId, @RequestParam String date){
        Map<String, Object> result = new HashMap<>();
        LambdaQueryWrapper<DietRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DietRecord::getUserId, userId)
                .eq(DietRecord::getRecordDate, date)
                .orderByDesc(DietRecord::getCreatedAt);
        List<DietRecord> list = dietRecordService.list(wrapper);
        result.put("code", 200);
        result.put("data", list);
        return result;
    }
    // 删除记录
    @DeleteMapping("/delete/{id}")
    public Map<String, Object> delete(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        boolean success = dietRecordService.removeById(id);
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
