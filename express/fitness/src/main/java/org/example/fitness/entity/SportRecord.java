package org.example.fitness.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("sport_record")
public class SportRecord {
@TableId(type = IdType.AUTO)
private Integer id;
    private Integer userId;
    private String exerciseType;
    private String exerciseName;
    private Integer duration;
    private Integer calories;
    private String notes;
    private LocalDate recordDate;
    private LocalDateTime createdAt;

}
