package org.example.fitness.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;

@Data
@TableName("checkin_record")
public class CheckinRecord {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private Integer userId;
    private LocalDate checkinDate;
    private Boolean exercise;
    private Boolean diet;
    private Boolean water;
    private Boolean sleep;
    private Boolean nosnack;
    private Boolean weightLog;
}
